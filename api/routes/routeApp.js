const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { getNotifications, sendFeedback } = require('../controllers/ctrlApp');

router.post('/getNotifications', verifyToken, getNotifications);
router.post('/sendFeedback', verifyToken, sendFeedback);

module.exports = router;