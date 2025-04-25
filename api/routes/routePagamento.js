const router = require('express').Router();
const { webhookAsaas } = require('../asaas');
const verifyToken = require('../authMiddleware');
const { processPagamento, getPIXPagamento, getPagamentos, deletePagamento, getCartoes, deleteCartao, gerarIdCarteira, criarPagamentoAluno, getPIXPagamentoAluno, getBalance, getBankExtract, createCardToken } = require('../controllers/ctrlPagamento');

router.post('/getBankExtract', verifyToken, getBankExtract);
router.post('/getBalance', verifyToken, getBalance);
router.post('/gerarIdCarteira', verifyToken, gerarIdCarteira);
router.post('/criarPagamentoAluno', verifyToken, criarPagamentoAluno);
router.post('/createCardToken', verifyToken, createCardToken);
router.post('/getPIXPagamentoAluno', verifyToken, getPIXPagamentoAluno);

router.post('/getPIXPagamento', verifyToken, getPIXPagamento);
router.post('/getPagamentos', verifyToken, getPagamentos);
router.post('/deletePagamento', verifyToken, deletePagamento);
router.post('/getCartoes', verifyToken, getCartoes);
router.post('/deleteCartao', verifyToken, deleteCartao);

router.post('/webhookAsaas', webhookAsaas);

module.exports = router;