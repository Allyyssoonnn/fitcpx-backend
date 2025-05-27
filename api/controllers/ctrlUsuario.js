const { tab_usuario, tab_empresa, tab_protocolo, tab_refreshtoken_usuario, tab_google_token } = require('../../database/models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Sequelize, where, Op } = require('sequelize');
const { getURL, connected } = require('../google');
const { sendEmail, getMsgEmailRecovery, getMsgEmailConfirmation } = require('../sendgrid');
const { updateAccount } = require('../stripe');
const env = process.env.NODE_ENV || 'development';
const dev = env === 'development';
const devToken = process.env.DEV_TOKEN;

async function login(req, res) {    
    const { email, senha } = req.body;

    const usuario = await tab_usuario.findOne({
        where: { email_usuario: email.trim() },
        include: [
            {
                model: tab_empresa,
                as: 'empresa',
            }
        ]
    });
    
    if (!usuario) {
        res.send({ status: false, msg: 'E-mail não cadastrado!' });
        return;
    }

    if (usuario.senha_usuario !== senha) {
        res.send({ status: false, msg: 'Senha incorreta!' });
        return;
    }

    const empresa = await tab_empresa.findOne({ where: { cod_empresa: usuario.cod_empresa } });

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const expirationTime = 7 * 24 * 60 * 60 * 1000; // Exemplo: 7 dias em milissegundos
    const expiresAt = new Date(Date.now() + expirationTime);

    const token = jwt.sign({ cod_usuario: usuario.cod_usuario }, process.env.SECRET, { expiresIn: '7h' });
    const refreshToken = crypto.randomBytes(64).toString('hex');
    tab_refreshtoken_usuario.create({
        cod_usuario: usuario.cod_usuario,
        refreshtoken_usuario: refreshToken,
        useragent_usuario: userAgent,
        ip_usuario: ipAddress,
        expiresAt: expiresAt,
    });
    res.send({ status: true, token, refreshToken, usuario, empresa });
}

async function register(req, res) {
    const { nome_usuario, email_usuario, senha_usuario, senha_confirma } = req.body;

    const usuario = await tab_usuario.findOne({ where: { email_usuario: email_usuario.trim() } });
    
    if (usuario) {
        res.send({ status: false, msg: 'E-mail já cadastrado!' });
        return;
    }
    
    if (senha_usuario !== senha_confirma) {
        res.send({ status: false, msg: 'Senhas não correspondem!' });
        return;
    }
    const email_codigo = [...crypto.randomFillSync(Buffer.alloc(4))].map(n => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[n % 36]).join('');

    const novaEmpresa = await tab_empresa.create({
        nome_empresa: nome_usuario,
        status_empresa: 'Active',
        email_empresa: email_usuario,
        email_codigo: dev ? '1234' : email_codigo,
    });
    const novoUsuario = await tab_usuario.create({ ...req.body, cod_empresa: novaEmpresa.cod_empresa, admin_usuario: 'S' });
    
    const empresa = await tab_empresa.findOne({ where: { cod_empresa: novaEmpresa.cod_empresa } });
    
    const msgHtml = await getMsgEmailConfirmation(empresa);

    sendEmail(email_usuario, msgHtml, 'FitCpx - E-mail de verificação');

    const token = jwt.sign({ email_usuario }, process.env.SECRET);
    const refreshToken = crypto.randomBytes(64).toString('hex');
    res.send({ status: true, token, refreshToken, usuario: novoUsuario, empresa });
}

async function recovery(req, res) {
    const { email } = req.body;

    const usuario = await tab_usuario.findOne({ where: { email_usuario: email.trim() } });

    if (!usuario) {
        res.send({ status: false, msg: 'E-mail não cadastrado!' });
        return;
    }

    const token = jwt.sign({ cod_usuario: usuario.cod_usuario }, process.env.SECRET, { expiresIn: '1h' });
    
    const msgHtml = await getMsgEmailRecovery(usuario, token);

    await sendEmail(email, msgHtml, 'FitCpx - E-mail de recuperação');

    res.send({ status: true });
}

async function verifyTokenRecovery(req, res) {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const usuario = await tab_usuario.findOne({ where: { cod_usuario: decoded.cod_usuario } });

        if (!usuario) {
            res.send({ status: false, msg: 'Usuário não encontrado!' });
            return;
        }
        
        res.send({ status: true, email_usuario: usuario.email_usuario });
    } catch (error) {
        res.send({ status: true, msg: 'Token expirado!' });
    }
}

async function changePassword(req, res) {
    const { token, senha } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        tab_usuario.update({ senha_usuario: senha }, { where: { cod_usuario: decoded.cod_usuario } });
        
        res.send({ status: true });
    } catch (error) {
        res.send({ status: true, msg: 'Token expirado!' });
    }
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (dev && refreshToken === devToken) {
        const usuario = await tab_usuario.findOne({ where: { cod_usuario: 1 } });
        const empresa = usuario?.cod_empresa ? await tab_empresa.findOne({ where: { cod_empresa: usuario.cod_empresa } }) : null;

        res.send({ status: true, token: refreshToken, usuario, empresa });
        return;
    }

    if (!refreshToken) return res.status(403).send({ status: false, msg: 'Token de atualização não fornecido!' });

    const refreshTokenValido = await tab_refreshtoken_usuario.findOne({
        where: {
            refreshtoken_usuario: refreshToken,
            expiresAt: {
                [Op.gte]: new Date()
            }
        }
    });

    const refreshTokenExpirado = await tab_refreshtoken_usuario.findOne({
        where: {
            refreshtoken_usuario: refreshToken,
            expiresAt: {
                [Op.lt]: new Date() // Verifica se a data de expiração é menor que a data atual
            }
        }
    });
    if (refreshTokenExpirado) await tab_refreshtoken_usuario.update({ deletedAt: new Date() }, { where: { cod_refreshtoken_usuario: refreshTokenExpirado.cod_refreshtoken_usuario } });

    if (!refreshTokenValido) {
        return res.status(403).send({ status: false, msg: 'Token inválido!' });
    }

    const usuario = await tab_usuario.findOne({ where: { cod_usuario: refreshTokenValido.cod_usuario } });
    const empresa = await tab_empresa.findOne({ where: { cod_empresa: usuario.cod_empresa } });
    
    const newToken = jwt.sign({ email: usuario.email_usuario }, process.env.SECRET, { expiresIn: '7h' });
    res.send({ status: true, token: newToken, usuario, empresa });
}

async function getProtocolos(req, res) {    
    const { cod_usuario } = req.body;
    const protocolos = await tab_protocolo.findAll();
    const groupedProtocolos = protocolos.reduce((acc, protocolo) => {
        if (!acc[protocolo.categoria_protocolo]) {
            acc[protocolo.categoria_protocolo] = [];
        }
        acc[protocolo.categoria_protocolo].push(protocolo);
        return acc;
    }, {});
    res.send({ status: true, protocolos: groupedProtocolos });
}

async function getUsuarios(req, res) {
    const { cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    const usuarios = await tab_usuario.findAll({
        where: { cod_empresa: cod_empresa, ...where },
        attributes: { exclude: ['refreshToken'] },
        paranoid: !deleted,
    });
    res.send({ status: true, usuarios });
}

async function setUsuario(req, res) {    
    const { usuario } = req.body;
    var usuarioAtt;

    if (usuario?.cod_usuario) usuarioAtt = await tab_usuario.findOne({ where: { cod_usuario: usuario.cod_usuario } });

    if (usuarioAtt) {
        await tab_usuario.update(usuario, { where: { cod_usuario: usuario.cod_usuario } });
    } else {
        const novoUsuario = await tab_usuario.create(usuario);
        usuarioAtt = novoUsuario;
    }

    res.send({ status: true, usuario: usuarioAtt });
}

async function getEmpresa(req, res) {
    const { cod_empresa } = req.body;
    const empresa = await tab_empresa.findAll({
        where: { cod_empresa: cod_empresa },
        attributes: { exclude: ['apikey_empresa', 'walletid_empresa'] },
    });
    res.send({ status: true, empresa });
}

async function setEmpresa(req, res) {    
    const { empresa } = req.body;
    var empresaAtt;

    if (empresa?.cod_empresa) empresaAtt = await tab_empresa.findOne({
        where: { cod_empresa: empresa.cod_empresa },
        attributes: { exclude: ['apikey_empresa', 'walletid_empresa'] }
    });

    if (empresaAtt) {
        await tab_empresa.update(empresa, { where: { cod_empresa: empresa.cod_empresa } });

        //Verifica se empresa está cadastrado no asaas e atualiza informações
        const empresaBD = await tab_empresa.findOne({ where: { cod_empresa: empresa.cod_empresa } });
        const accountId = env === 'development' ? empresaBD.dev_stripe_id : empresaBD.stripe_id;
        if (accountId) await updateAccount(empresaAtt, accountId);
    } else {
        const novaEmpresa = await tab_empresa.create(empresa);
        empresaAtt = novaEmpresa;
    }

    res.send({ status: true, empresa: empresaAtt });
}

async function verifyEmail(req, res, codEmpresa) {
    const { cod_empresa } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa: cod_empresa || codEmpresa } });

    const msgHtml = await getMsgEmailConfirmation(empresa);

    sendEmail(empresa.email_empresa, msgHtml, 'FitCpx - E-mail de verificação');

    if (res) res.send({ status: true });
}

async function loginGoogle(req, res) {
    const url = await getURL('entrar');
    res.send({ status: true, url });
}

async function loggedGoogle(req, res) {
    const { code, scope, cod_empresa } = req.body;
    const data = await connected(code, 'entrar');

    if (!data?.email) {
        res.send({ status: false, msg: 'Falha na autenticação!' });
        return;
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const expirationTime = 7 * 24 * 60 * 60 * 1000; // Exemplo: 7 dias em milissegundos
    const expiresAt = new Date(Date.now() + expirationTime);

    const usuario = await tab_usuario.findOne({ where: { email_usuario: data.email.trim() } });

    if (!usuario) {
        //Cria novo usuário com o google
        const empresa = await tab_empresa.create({
            nome_empresa: data?.name,
            email_empresa: data.email.trim(),
            //Id do E-mail do google
            email_codigo: data?.id,
        });
        const novoUsuario = await tab_usuario.create({
            nome_usuario: data?.name,
            email_usuario: data.email.trim(),
            senha_usuario: [...crypto.randomFillSync(Buffer.alloc(8))].map(n => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[n % 36]).join(''),
            imagem_usuario: data?.picture,
            cod_empresa: empresa.cod_empresa,
            admin_usuario: 'S',
        });
        
        const token = jwt.sign({ email_usuario: data.email.trim() }, process.env.SECRET);
        const refreshToken = crypto.randomBytes(64).toString('hex');
        tab_refreshtoken_usuario.create({
            cod_usuario: novoUsuario.cod_usuario,
            refreshtoken_usuario: refreshToken,
            useragent_usuario: userAgent,
            ip_usuario: ipAddress,
            expiresAt: expiresAt,
        });

        res.send({ status: true, token, refreshToken, usuario: novoUsuario });
    } else {
        //Faz login do usuário com o google
        const empresa = await tab_empresa.findOne({ where: { cod_empresa: usuario.cod_empresa } });
        const token = jwt.sign({ cod_usuario: usuario.cod_usuario }, process.env.SECRET, { expiresIn: '7h' });
        const refreshToken = crypto.randomBytes(64).toString('hex');
        tab_refreshtoken_usuario.create({
            cod_usuario: usuario.cod_usuario,
            refreshtoken_usuario: refreshToken,
            useragent_usuario: userAgent,
            ip_usuario: ipAddress,
            expiresAt: expiresAt,
        });
        res.send({ status: true, token, refreshToken, usuario, empresa });
    }
}

module.exports = {
    login,
    register,
    recovery,
    verifyTokenRecovery,
    changePassword,
    refreshToken,
    getProtocolos,
    getUsuarios,
    setUsuario,
    getEmpresa,
    setEmpresa,
    verifyEmail,
    loginGoogle,
    loggedGoogle,
}