const { tab_aluno, tab_refreshtoken_aluno } = require('../../database/models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

async function login(req, res) {    
    const { email, senha } = req.body;

    const aluno = await tab_aluno.findOne({
        where: { email_aluno: email.trim() }
    });
    
    if (!aluno) {
        res.send({ status: true, msg: 'E-mail não cadastrado!' });
        return;
    }

    if (aluno.senha_aluno !== senha) {
        res.send({ status: true, msg: 'Senha incorreta!' });
        return;
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const expirationTime = 7 * 24 * 60 * 60 * 1000; // Exemplo: 7 dias em milissegundos
    const expiresAt = new Date(Date.now() + expirationTime);

    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '7h' });
    const refreshToken = crypto.randomBytes(64).toString('hex');
    tab_refreshtoken_aluno.create({
        cod_aluno: aluno.cod_aluno,
        refreshtoken_aluno: refreshToken,
        useragent_aluno: userAgent,
        ip_aluno: ipAddress,
        expiresAt: expiresAt,
    });
    res.send({ status: true, token, refreshToken, aluno });
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(403).send({ status: false, msg: 'Token de atualização não fornecido!' });

    const refreshTokenValido = await tab_refreshtoken_aluno.findOne({
        where: {
            refreshtoken_aluno: refreshToken,
            expires_at: {
                [Op.gte]: new Date()
            }
        }
    });

    const refreshTokenExpirado = await tab_refreshtoken_aluno.findOne({
        where: {
            refreshtoken_aluno: refreshToken,
            expires_at: {
                [Op.lt]: new Date() // Verifica se a data de expiração é menor que a data atual
            }
        }
    });
    if (refreshTokenExpirado) await tab_refreshtoken_aluno.update({ deletedAt: new Date() }, { where: { cod_refreshtoken_aluno: refreshTokenExpirado.cod_refreshtoken_aluno } });

    if (!refreshTokenValido) {
        return res.status(403).send({ status: false, msg: 'Token inválido!' });
    }

    const usuario = await tab_usuario.findOne({ where: { cod_usuario: refreshTokenValido.cod_usuario } });
    
    const newToken = jwt.sign({ email: usuario.email_usuario }, process.env.SECRET, { expiresIn: '7h' });
    res.send({ status: true, token: newToken });
}

module.exports = {
    login,
    refreshToken,
}