const router = require('express').Router();
const verifyToken = require('../authMiddleware');

const { getAlunos, setAluno, getAluno, setAvaliacao, getAvaliacao, changeAlunoIMG, sendAvaliacaoIMG, deleteAluno, recoveryAluno, getAvaliacoes, deleteAvaliacao, setAlunoContrato, getAlunoContratos, getAlunoContrato, sendAlunoContrato } = require('../controllers/ctrlAluno');
const { uploadIMGAvaliacao, uploadIMGAluno } = require('../aws');
const { multerAutentique } = require('../autentique');

router.post('/getAlunos', verifyToken, getAlunos);
router.post('/getAluno', verifyToken, getAluno);
router.post('/setAluno', verifyToken, setAluno);
router.post('/deleteAluno', verifyToken, deleteAluno);
router.post('/recoveryAluno', verifyToken, recoveryAluno);
router.post('/getAvaliacoes', verifyToken, getAvaliacoes);
router.post('/getAvaliacao', verifyToken, getAvaliacao);
router.post('/setAvaliacao', verifyToken, setAvaliacao);
router.post('/deleteAvaliacao', verifyToken, deleteAvaliacao);
router.post('/setAlunoContrato', verifyToken, setAlunoContrato);
router.post('/sendAlunoContrato', verifyToken, multerAutentique(), sendAlunoContrato);
router.post('/getAlunoContratos', verifyToken, getAlunoContratos);
router.post('/getAlunoContrato', verifyToken, getAlunoContrato);

router.post('/changeAlunoIMG', uploadIMGAluno);
router.post('/sendAvaliacaoIMG', uploadIMGAvaliacao);

module.exports = router;