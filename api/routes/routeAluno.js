const router = require('express').Router();

const { getAlunos, setAluno } = require('../controllers/ctrlAluno');

router.post('/getAlunos', getAlunos);
router.post('/setAluno', setAluno);

module.exports = router;