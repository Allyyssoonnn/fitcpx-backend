const { tab_usuario } = require('../../database/models');
const jwt = require('jsonwebtoken');

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

    const token = jwt.sign({ email }, process.env.SECRET);
    res.send({ status: true, token, nome_usuario: usuario.nome_usuario });
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

module.exports = {
    login,
    register
}