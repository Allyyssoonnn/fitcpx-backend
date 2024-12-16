const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const verifyToken = require('../authMiddleware');

const { login, register, refreshToken, getProtocolos, changeUsuarioIMG, setUsuario } = require('../controllers/ctrlUsuario');

router.post('/login', login);
router.post('/register', register);
router.post('/refreshToken', refreshToken);
router.post('/getProtocolos', getProtocolos);
router.post('/setUsuario', verifyToken, setUsuario);

router.post('/changeUsuarioIMG', upload.single('image'), changeUsuarioIMG);

module.exports = router;