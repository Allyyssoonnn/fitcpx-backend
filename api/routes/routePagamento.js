const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { criarPagamentoAluno, buscarCobrancaAluno, pagarCobranca } = require('../controllers/ctrlPagamento');

router.post('/criarPagamentoAluno', verifyToken, criarPagamentoAluno);
router.post('/buscarCobrancaAluno', verifyToken, buscarCobrancaAluno);
router.post('/pagarCobranca', verifyToken, pagarCobranca);

module.exports = router;