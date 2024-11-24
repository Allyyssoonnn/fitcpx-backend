const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { getAgenda, setAgenda } = require('../controllers/ctrlAgenda');

router.post('/getAgenda', verifyToken, getAgenda);
router.post('/setAgenda', verifyToken, setAgenda);

module.exports = router;