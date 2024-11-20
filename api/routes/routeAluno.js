const router = require('express').Router();

const verifyToken = require('../authMiddleware');
const { getAlunos, setAluno, getAluno } = require('../controllers/ctrlAluno');

router.post('/getAlunos', verifyToken, getAlunos);
router.post('/getAluno', verifyToken, getAluno);
router.post('/setAluno', verifyToken, setAluno);

module.exports = router;