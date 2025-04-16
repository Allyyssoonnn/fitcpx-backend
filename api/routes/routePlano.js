const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { setPlano, getPlanos, deletePlano, recoveryPlano, setModalidade, getModalidades, deleteModalidade, recoveryModalidade, getContratos, deleteContrato, recoveryContrato, setContrato } = require('../controllers/ctrlPlano');

router.post('/setPlano', verifyToken, setPlano);
router.post('/getPlanos', verifyToken, getPlanos);
router.post('/deletePlano', verifyToken, deletePlano);
router.post('/recoveryPlano', verifyToken, recoveryPlano);
router.post('/setModalidade', verifyToken, setModalidade);
router.post('/getModalidades', verifyToken, getModalidades);
router.post('/deleteModalidade', verifyToken, deleteModalidade);
router.post('/recoveryModalidade', verifyToken, recoveryModalidade);
router.post('/getContratos', verifyToken, getContratos);
router.post('/setContrato', verifyToken, setContrato);
router.post('/deleteContrato', verifyToken, deleteContrato);
router.post('/recoveryContrato', verifyToken, recoveryContrato);

module.exports = router;