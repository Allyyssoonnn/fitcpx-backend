const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { getPagamento, donePagamento, getAssinatura } = require('../controllers/ctrlPagamento');
const { webhookPagamento } = require('../mercadopago');

router.post('/getPagamento', verifyToken, getPagamento);
router.post('/donePagamento', verifyToken, donePagamento);

router.post('/webhookPagamento', webhookPagamento);

module.exports = router;