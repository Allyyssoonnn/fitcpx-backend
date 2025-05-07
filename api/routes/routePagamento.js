const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { gerarIdCarteira, criarPagamentoAluno, getBalance, getBankExtract, getStatusConta, sendDocument, deletarConta, getIntentCard, getCards } = require('../controllers/ctrlPagamento');

//STRIPE
router.post('/deleteAccount', verifyToken, deletarConta);
router.post('/gerarIdCarteira', verifyToken, gerarIdCarteira);
router.post('/getStatusAccount', verifyToken, getStatusConta);
router.post('/sendDocuments', verifyToken, sendDocument);
router.post('/getSetupIntent', verifyToken, getIntentCard);
router.post('/getPaymentsMethod', verifyToken, getCards);
router.post('/criarPagamentoAluno', verifyToken, criarPagamentoAluno);
router.post('/getBalance', verifyToken, getBalance);
router.post('/getBankExtract', verifyToken, getBankExtract);

module.exports = router;