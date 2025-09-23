const router = require("express").Router();
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

router.post("/getTreinos", getTreinos);
router.post("/getTreino", getTreino);
router.post("/setTreino", setTreino);
router.post("/deleteTreino", deleteTreino);

router.post("/getGrupoExercicios", getGrupoExercicios);
router.post("/setGrupoExercicio", setGrupoExercicio);
router.post("/deleteGrupoExercicio", deleteGrupoExercicio);
router.post("/recoveryGrupoExercicio", recoveryGrupoExercicio);

router.post("/getExercicios", getExercicios);
router.post("/setExercicio", setExercicio);
router.post("/deleteExercicio", deleteExercicio);
router.post("/recoveryExercicio", recoveryExercicio);

// router.post('/getSessoes', getSessoes);
router.post("/setSessoes", setSessoes);
router.post("/deleteSessao", deleteSessao);
router.post("/recoverySessao", recoverySessao);

router.post("/getEquipamentos", getEquipamentos);
router.post("/getArticulacoes", getArticulacoes);
router.post("/getTipoExercicios", getTipoExercicios);
router.post("/getExerciciosResistencias", getExerciciosResistencias);
router.post("/getIndicacoes", getIndicacoes);
router.post("/getPadraoesMovimentos", getPadraoesMovimentos);

module.exports = router;
