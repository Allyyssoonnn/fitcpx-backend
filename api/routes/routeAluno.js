const router = require('express').Router();

const verifyToken = require('../authMiddleware');
const { getAlunos, setAluno, getAluno, setAvaliacao, getAvaliacao } = require('../controllers/ctrlAluno');

router.post('/getAlunos', verifyToken, getAlunos);
router.post('/getAluno', verifyToken, getAluno);
router.post('/setAluno', verifyToken, setAluno);
router.post('/getAvaliacao', verifyToken, getAvaliacao);
router.post('/setAvaliacao', verifyToken, setAvaliacao);

module.exports = router;