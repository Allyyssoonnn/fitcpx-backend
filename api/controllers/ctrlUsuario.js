const { tab_usuario } = require('../../database/models');
const { tab_protocolo } = require('../../database/models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { uploadUsuarioIMGAWS } = require('../../utils');

async function login(req, res) {    
    const { email, senha } = req.body;

    const usuario = await tab_usuario.findOne({ where: { email_usuario: email.trim() } });
    
    if (!usuario) {
        res.send({ status: false, msg: 'E-mail não cadastrado!' });
        return;
    }

    if (usuario.senha_usuario !== senha) {
        res.send({ status: false, msg: 'Senha incorreta!' });
        return;
    }

    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '7h' });
    const refreshToken = crypto.randomBytes(64).toString('hex');
    usuario.refreshToken = refreshToken;
    usuario.save();
    res.send({
        status: true,
        token,
        refreshToken,
        imagem_usuario: usuario.imagem_usuario,
        cod_usuario: usuario.cod_usuario,
        nome_usuario: usuario.nome_usuario,
        email_usuario: usuario.email_usuario,
        telefone_usuario: usuario.telefone_usuario,
        celular_usuario: usuario.celular_usuario,
        cep_usuario: usuario.cep_usuario,
        endereco_usuario: usuario.endereco_usuario,
        numero_usuario: usuario.numero_usuario,
        complemento_usuario: usuario.complemento_usuario,
        bairro_usuario: usuario.bairro_usuario,
        estado_usuario: usuario.estado_usuario,
        cidade_usuario: usuario.cidade_usuario,
    });
}

async function register(req, res) {
    const { email_usuario, senha_usuario, senha_confirma } = req.body;

    const usuario = await tab_usuario.findOne({ where: { email_usuario: email_usuario.trim() } });
    
    if (usuario) {
        res.send({ status: false, msg: 'E-mail já cadastrado!' });
        return;
    }
    
    if (senha_usuario !== senha_confirma) {
        res.send({ status: false, msg: 'Senhas não correspondem!' });
        return;
    }
    
    const novoUsuario = tab_usuario.create(req.body);

    const token = jwt.sign({ email_usuario }, process.env.SECRET);
    res.send({ status: true, token, usuario: novoUsuario });
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(403).send({ status: false, msg: 'Token de atualização não fornecido!' });

    const usuario = await tab_usuario.findOne({ where: { refreshToken } });

    if (!usuario) {
        return res.status(403).send({ status: false, msg: 'Token inválido!' });
    }

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

async function changeUsuarioIMG(req, res) {
    const cod_usuario = req.headers['cod_usuario'];
    const fileId = await uploadUsuarioIMGAWS(req.file.path, req.file.mimetype);
    const usuario = await tab_usuario.findOne({ where: { cod_usuario } });
    usuario.imagem_usuario = fileId;
    usuario.save();

    res.send({ status: true, id: fileId });
}

async function setUsuario(req, res) {    
    const { usuario } = req.body;
    await tab_usuario.update(usuario, { where: { cod_usuario: usuario.cod_usuario } });
    res.send({ status: true, usuario });
}

module.exports = {
    login,
    register,
    refreshToken,
    getProtocolos,
    changeUsuarioIMG,
    setUsuario,
}