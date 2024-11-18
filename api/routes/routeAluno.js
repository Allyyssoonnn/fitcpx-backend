const router = require('express').Router();

const { getAlunos } = require('../controllers/ctrlAluno');

router.post('/getAlunos', getAlunos);

module.exports = router;