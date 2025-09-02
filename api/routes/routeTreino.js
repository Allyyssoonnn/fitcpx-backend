const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
   getTreinos,
   getGrupoExercicios,
   setGrupoExercicio,
   deleteGrupoExercicio,
   recoveryGrupoExercicio,
   getExercicios,
   setExercicio,
   deleteExercicio,
   recoveryExercicio,
   deleteSessao,
   recoverySessao,
   setSessoes,
   setTreino,
   getEquipamentos,
   getArticulacoes,
   getTipoExercicios,
   getExerciciosResistencias,
   getIndicacoes,
   getPadraoesMovimentos,
   deleteTreino,
   getTreino,
} = require("../controllers/ctrlTreino");
const { generateTreino } = require("../features/treinoInteligente");

router.post("/generateTreino", verifyToken, generateTreino);

router.post("/getTreinos", getTreinos);
router.post("/getTreino", getTreino);
router.post("/setTreino", verifyToken, setTreino);
router.post("/deleteTreino", verifyToken, deleteTreino);

router.post("/getGrupoExercicios", getGrupoExercicios);
router.post("/setGrupoExercicio", verifyToken, setGrupoExercicio);
router.post("/deleteGrupoExercicio", verifyToken, deleteGrupoExercicio);
router.post("/recoveryGrupoExercicio", verifyToken, recoveryGrupoExercicio);

router.post("/getExercicios", getExercicios);
router.post("/setExercicio", verifyToken, setExercicio);
router.post("/deleteExercicio", verifyToken, deleteExercicio);
router.post("/recoveryExercicio", verifyToken, recoveryExercicio);

// router.post('/getSessoes', verifyToken, getSessoes);
router.post("/setSessoes", verifyToken, setSessoes);
router.post("/deleteSessao", verifyToken, deleteSessao);
router.post("/recoverySessao", verifyToken, recoverySessao);

router.post("/getEquipamentos", getEquipamentos);
router.post("/getArticulacoes", getArticulacoes);
router.post("/getTipoExercicios", getTipoExercicios);
router.post("/getExerciciosResistencias", getExerciciosResistencias);
router.post("/getIndicacoes", getIndicacoes);
router.post("/getPadraoesMovimentos", getPadraoesMovimentos);

module.exports = router;
