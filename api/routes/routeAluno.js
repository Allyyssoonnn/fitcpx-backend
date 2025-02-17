const router = require('express').Router();
const verifyToken = require('../authMiddleware');

const { getAlunos, setAluno, getAluno, setAvaliacao, getAvaliacao, changeAlunoIMG, sendAvaliacaoIMG, deleteAluno, recoveryAluno, getAvaliacoes, deleteAvaliacao } = require('../controllers/ctrlAluno');
const { uploadIMGAvaliacao, uploadIMGAluno } = require('../aws');

router.post('/getAlunos', verifyToken, getAlunos);
router.post('/getAluno', verifyToken, getAluno);
router.post('/setAluno', verifyToken, setAluno);
router.post('/deleteAluno', verifyToken, deleteAluno);
router.post('/recoveryAluno', verifyToken, recoveryAluno);
router.post('/getAvaliacoes', verifyToken, getAvaliacoes);
router.post('/getAvaliacao', verifyToken, getAvaliacao);
router.post('/setAvaliacao', verifyToken, setAvaliacao);
router.post('/deleteAvaliacao', verifyToken, deleteAvaliacao);

router.post('/changeAlunoIMG', uploadIMGAluno);
router.post('/sendAvaliacaoIMG', uploadIMGAvaliacao);

module.exports = router;