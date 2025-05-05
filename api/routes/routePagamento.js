const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { processPagamento, getPIXPagamento, getPagamentos, deletePagamento, getCartoes, deleteCartao, gerarIdCarteira, criarPagamentoAluno, getPIXPagamentoAluno, getBalance, getBankExtract, createCardToken, getStatusConta, sendDocument, deletarConta } = require('../controllers/ctrlPagamento');

//STRIPE
router.post('/deleteAccount', verifyToken, deletarConta);
router.post('/gerarIdCarteira', verifyToken, gerarIdCarteira);
router.post('/getStatusAccount', verifyToken, getStatusConta);
router.post('/sendDocuments', verifyToken, sendDocument);

//ASAAS ANTIGO
router.post('/getBankExtract', verifyToken, getBankExtract);
router.post('/getBalance', verifyToken, getBalance);

router.post('/criarPagamentoAluno', verifyToken, criarPagamentoAluno);
router.post('/createCardToken', verifyToken, createCardToken);
router.post('/getPIXPagamentoAluno', verifyToken, getPIXPagamentoAluno);

router.post('/getPIXPagamento', verifyToken, getPIXPagamento);
router.post('/getPagamentos', verifyToken, getPagamentos);
router.post('/deletePagamento', verifyToken, deletePagamento);
router.post('/getCartoes', verifyToken, getCartoes);
router.post('/deleteCartao', verifyToken, deleteCartao);

module.exports = router;