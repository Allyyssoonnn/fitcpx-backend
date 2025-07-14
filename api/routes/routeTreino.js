const router = require('express').Router();
const verifyToken = require('../authMiddleware');
const { getTreinos, getGrupoExercicios, setGrupoExercicio, deleteGrupoExercicio, recoveryGrupoExercicio, getExercicios, setExercicio, deleteExercicio, recoveryExercicio, deleteSessao, recoverySessao, setSessoes, setTreino, getEquipamentos, getArticulacoes, getTipoExercicios, getExerciciosResistencias, getIndicacoes, getPadraoesMovimentos, deleteTreino, getTreino } = require('../controllers/ctrlTreino');
const { generateTreino } = require('../features/treinoInteligente');

router.post('/generateTreino', verifyToken, generateTreino);

router.post('/getTreinos', verifyToken, getTreinos);
router.post('/getTreino', verifyToken, getTreino);
router.post('/setTreino', verifyToken, setTreino);
router.post('/deleteTreino', verifyToken, deleteTreino);

router.post('/getGrupoExercicios', verifyToken, getGrupoExercicios);
router.post('/setGrupoExercicio', verifyToken, setGrupoExercicio);
router.post('/deleteGrupoExercicio', verifyToken, deleteGrupoExercicio);
router.post('/recoveryGrupoExercicio', verifyToken, recoveryGrupoExercicio);

router.post('/getExercicios', getExercicios);
router.post('/setExercicio', verifyToken, setExercicio);
router.post('/deleteExercicio', verifyToken, deleteExercicio);
router.post('/recoveryExercicio', verifyToken, recoveryExercicio);

// router.post('/getSessoes', verifyToken, getSessoes);
router.post('/setSessoes', verifyToken, setSessoes);
router.post('/deleteSessao', verifyToken, deleteSessao);
router.post('/recoverySessao', verifyToken, recoverySessao);

router.post('/getEquipamentos', verifyToken, getEquipamentos);
router.post('/getArticulacoes', verifyToken, getArticulacoes);
router.post('/getTipoExercicios', verifyToken, getTipoExercicios);
router.post('/getExerciciosResistencias', verifyToken, getExerciciosResistencias);
router.post('/getIndicacoes', verifyToken, getIndicacoes);
router.post('/getPadraoesMovimentos', verifyToken, getPadraoesMovimentos);

module.exports = router;