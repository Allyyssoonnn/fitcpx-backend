const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { login, refreshToken } = require('../controllers/ctrlAppAdmin');

router.post('/login', login);
router.post('/refreshToken', refreshToken);

module.exports = router;