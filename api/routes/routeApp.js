const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { getNotifications } = require('../controllers/ctrlApp');

router.post('/getNotifications', verifyToken, getNotifications);

module.exports = router;