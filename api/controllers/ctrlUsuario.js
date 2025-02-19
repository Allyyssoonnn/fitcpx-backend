const { tab_usuario, tab_empresa, tab_protocolo, tab_refreshtoken_usuario } = require('../../database/models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../../utils');
const { Sequelize, where, Op } = require('sequelize');

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
        email_empresa: email_usuario,
        email_codigo: email_codigo,
    });
    const novoUsuario = await tab_usuario.create({ ...req.body, cod_empresa: novaEmpresa.cod_empresa });
    
    //Envia E-mail com código de confirmação
    verifyEmail(null, null, novaEmpresa.cod_empresa);

    const token = jwt.sign({ email_usuario }, process.env.SECRET);
    const refreshToken = crypto.randomBytes(64).toString('hex');
    res.send({ status: true, token, refreshToken, usuario: novoUsuario });
}

async function recovery(req, res) {
    const { email } = req.body;

    const usuario = await tab_usuario.findOne({ where: { email_usuario: email.trim() } });

    if (!usuario) {
        res.send({ status: false, msg: 'E-mail não cadastrado!' });
        return;
    }

    const msg =
`
Olá, ${usuario.email_usuario}

Seu link de recuperação é:

//

Acesse o link para informar sua nova senha.

Se você não solicitou este link, ignore este e-mail.

Atenciosamente,
Fit Complex
`

    await sendEmail(email, msg, 'FitCpx - E-mail de recuperação');

    res.send({ status: true });
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;

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
    
    const newToken = jwt.sign({ email: usuario.email_usuario }, process.env.SECRET, { expiresIn: '7h' });
    res.send({ status: true, token: newToken });
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

async function verifyEmail(req, res, codEmpresa) {
    const { cod_empresa } = req.body;

    const empresa = await tab_empresa.findOne({ where: { cod_empresa: cod_empresa || codEmpresa } });

    const msg =
`
Olá, ${empresa.nome_empresa}

Seu código de verificação é: **${empresa.email_codigo}**  

Digite este código no aplicativo para continuar.  

Se você não solicitou este código, ignore este e-mail.  

Atenciosamente,
Fit Complex
`

    sendEmail(empresa.email_empresa, msg, 'FitCpx - E-mail de verificação');

    if (res) res.send({ status: true });
}

module.exports = {
    login,
    register,
    recovery,
    refreshToken,
    getProtocolos,
    getUsuarios,
    setUsuario,
    verifyEmail,
}