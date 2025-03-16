const router = require('express').Router();

const verifyToken = require('../authMiddleware');

const { login, register, refreshToken, getProtocolos, changeUsuarioIMG, setUsuario, getUsuarios, verifyEmail, recovery, loginGoogle, loggedGoogle, setEmpresa, verifyTokenRecovery, changePassword } = require('../controllers/ctrlUsuario');
const { uploadIMGUsuario, uploadIMGEmpresa } = require('../aws');

router.get('/loginGoogle', loginGoogle);
router.post('/loggedGoogle', loggedGoogle);

router.post('/login', login);
router.post('/register', register);
router.post('/recovery', recovery);
router.post('/verifyTokenRecovery', verifyTokenRecovery);
router.post('/changePassword', changePassword);
router.post('/refreshToken', refreshToken);
router.post('/getProtocolos', getProtocolos);
router.post('/getUsuarios', verifyToken, getUsuarios);
router.post('/setUsuario', verifyToken, setUsuario);
router.post('/setEmpresa', verifyToken, setEmpresa);

router.post('/changeUsuarioIMG', uploadIMGUsuario);
router.post('/changeEmpresaIMG', uploadIMGEmpresa);
router.post('/verifyEmail', verifyEmail, setUsuario);

module.exports = router;