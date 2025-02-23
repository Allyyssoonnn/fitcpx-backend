const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { login, refreshToken, finishTreino, getTreinosRealizados } = require('../controllers/ctrlAppAluno');

router.post('/login', login);
router.post('/refreshToken', refreshToken);
router.post('/finishTreino', verifyToken, finishTreino);
router.post('/getTreinosRealizados', verifyToken, getTreinosRealizados);

module.exports = router;