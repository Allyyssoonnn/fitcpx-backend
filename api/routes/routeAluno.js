const router = require('express').Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const verifyToken = require('../authMiddleware');
const { getAlunos, setAluno, getAluno, setAvaliacao, getAvaliacao, changeAlunoIMG } = require('../controllers/ctrlAluno');

router.post('/getAlunos', verifyToken, getAlunos);
router.post('/getAluno', verifyToken, getAluno);
router.post('/setAluno', verifyToken, setAluno);
router.post('/getAvaliacao', verifyToken, getAvaliacao);
router.post('/setAvaliacao', verifyToken, setAvaliacao);

router.post('/changeAlunoIMG', upload.single('image'), changeAlunoIMG);

module.exports = router;