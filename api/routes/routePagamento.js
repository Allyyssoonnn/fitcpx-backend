const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { criarPagamentoAluno, buscarCobrancaAluno } = require('../controllers/ctrlPagamento');

router.post('/criarPagamentoAluno', verifyToken, criarPagamentoAluno);
router.post('/buscarCobrancaAluno', verifyToken, buscarCobrancaAluno);

module.exports = router;