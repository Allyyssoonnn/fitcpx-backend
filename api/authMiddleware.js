const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Extrai o token do cabeçalho "Authorization"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ status: false, msg: 'Token não fornecido!' });
    }

    // Remove o prefixo "Bearer" do token, se existir
    // const token = authHeader.split(' ')[1];
    const token = authHeader;

    if (!token) {
        return res.status(401).send({ status: false, msg: 'Token malformado!' });
    }

    try {
        // Valida o token e decodifica os dados
        const decoded = jwt.verify(token, process.env.SECRET);

        // Adiciona os dados do token à requisição para uso posterior
        req.usuario = decoded;

        // Continua para o próximo middleware ou rota
        next();
    } catch (err) {
        // Retorna erro se o token for inválido ou expirado
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ status: false, msg: 'Token expirado!' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({ status: false, msg: 'Token inválido!' });
        }

        return res.status(500).send({ status: false, msg: 'Erro ao validar token!' });
    }
}

module.exports = verifyToken;