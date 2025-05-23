const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { gerarIdCarteira, criarPagamentoAluno, getBalance, getBankExtract, getStatusConta, sendDocument, deletarConta, getIntentCard, getCards, getIntentPayment, updateMethodPayment, updatePaymentIntentStatus, doRefundPayment } = require('../controllers/ctrlPagamento');

//STRIPE
router.post('/gerarIdCarteira', verifyToken, gerarIdCarteira);
router.post('/getStatusAccount', verifyToken, getStatusConta);
router.post('/sendDocuments', verifyToken, sendDocument);
router.post('/getSetupIntentCard', verifyToken, getIntentCard);
router.post('/getPaymentsMethod', verifyToken, getCards);
router.post('/getIntentPayment', verifyToken, getIntentPayment);
router.post('/criarPagamentoAluno', verifyToken, criarPagamentoAluno);
router.post('/getBalance', verifyToken, getBalance);
router.post('/getBankExtract', verifyToken, getBankExtract);
router.post('/updateMethodPayment', verifyToken, updateMethodPayment);
router.post('/updatePaymentIntentStatus', verifyToken, updatePaymentIntentStatus);
router.post('/doRefundPayment', verifyToken, doRefundPayment);

module.exports = router;