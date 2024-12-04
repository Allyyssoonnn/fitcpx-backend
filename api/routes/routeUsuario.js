const router = require('express').Router();

const { login, register, refreshToken, getProtocolos } = require('../controllers/ctrlUsuario');

router.post('/login', login);
router.post('/register', register);
router.post('/refreshToken', refreshToken);
router.post('/getProtocolos', getProtocolos);

module.exports = router;