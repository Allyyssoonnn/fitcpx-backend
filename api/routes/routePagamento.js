const router = require('express').Router();
const { webhookAsaas } = require('../asaas');
const verifyToken = require('../authMiddleware');
const { processPagamento, getPIXPagamento, getPagamentos, deletePagamento, getCartoes, deleteCartao } = require('../controllers/ctrlPagamento');

router.post('/processPagamento', verifyToken, processPagamento);
router.post('/getPIXPagamento', verifyToken, getPIXPagamento);
router.post('/getPagamentos', verifyToken, getPagamentos);
router.post('/deletePagamento', verifyToken, deletePagamento);
router.post('/getCartoes', verifyToken, getCartoes);
router.post('/deleteCartao', verifyToken, deleteCartao);

router.post('/webhookAsaas', webhookAsaas);

module.exports = router;