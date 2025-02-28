const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { getAgenda, setAgenda, conectGoogle, conectedGoogle, getGoogleConnect, syncGoogleEvents } = require('../controllers/ctrlAgenda');

router.post('/getAgenda', verifyToken, getAgenda);
router.post('/setAgenda', verifyToken, setAgenda);
router.get('/conectGoogle', verifyToken, conectGoogle);
router.post('/conectedGoogle', verifyToken, conectedGoogle);
router.post('/getGoogleConnect', verifyToken, getGoogleConnect);
router.post('/syncGoogleEvents', verifyToken, syncGoogleEvents);

module.exports = router;