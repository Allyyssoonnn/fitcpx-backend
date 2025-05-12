const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { getLicencas, getLicenca } = require('../controllers/ctrlLicenca');

router.get('/getLicencas', verifyToken, getLicencas);
router.post('/getLicenca', verifyToken, getLicenca);

module.exports = router;