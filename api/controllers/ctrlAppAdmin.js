const { tab_admin, tab_refreshtoken_admin } = require('../../database/models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');

async function login(req, res) {    
    const { email, senha } = req.body;

    const admin = await tab_admin.findOne({
        where: { email_admin: email.trim() }
    });
    
    if (!admin) {
        res.send({ status: true, msg: 'E-mail não cadastrado!' });
        return;
    }

    if (admin.senha_admin !== senha) {
        res.send({ status: true, msg: 'Senha incorreta!' });
        return;
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const expirationTime = 7 * 24 * 60 * 60 * 1000; // Exemplo: 7 dias em milissegundos
    const expiresAt = new Date(Date.now() + expirationTime);

    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '7h' });
    const refreshToken = crypto.randomBytes(64).toString('hex');
    tab_refreshtoken_admin.create({
        cod_admin: admin.cod_admin,
        refreshtoken_admin: refreshToken,
        useragent_admin: userAgent,
        ip_admin: ipAddress,
        expiresAt: expiresAt,
    });
    res.send({ status: true, token, refreshToken, admin: admin });
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(403).send({ status: false, msg: 'Token de atualização não fornecido!' });

    const refreshTokenValido = await tab_refreshtoken_admin.findOne({
        where: {
            refreshtoken_admin: refreshToken,
            expiresAt: {
                [Op.gte]: new Date()
            }
        }
    });

    const refreshTokenExpirado = await tab_refreshtoken_admin.findOne({
        where: {
            refreshtoken_admin: refreshToken,
            expiresAt: {
                [Op.lt]: new Date() // Verifica se a data de expiração é menor que a data atual
            }
        }
    });
    if (refreshTokenExpirado) await tab_refreshtoken_admin.update({ deletedAt: new Date() }, { where: { cod_refreshtoken_admin: refreshTokenExpirado.cod_refreshtoken_admin } });

    if (!refreshTokenValido) {
        return res.status(403).send({ status: false, msg: 'Token inválido!' });
    }

    const admin = await tab_admin.findOne({ where: { cod_admin: refreshTokenValido.cod_admin } });
    
    const newToken = jwt.sign({ email: admin.email_admin }, process.env.SECRET, { expiresIn: '7h' });
    res.send({ status: true, token: newToken });
}

module.exports = {
    login,
    refreshToken,
}