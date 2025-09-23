const router = require("express").Router();

const {
   setAvaliacao,
   getAvaliacao,
   recoveryAluno,
   getAvaliacoes,
   deleteAvaliacao,
   setAlunoContrato,
   getAlunoContratos,
   getAlunoContrato,
} = require("../controllers/aluno/ctrlAluno");

router.post("/recoveryAluno", recoveryAluno);
router.post("/getAvaliacoes", getAvaliacoes);
router.post("/getAvaliacao", getAvaliacao);
router.post("/setAvaliacao", setAvaliacao);
router.post("/deleteAvaliacao", deleteAvaliacao);
router.post("/setAlunoContrato", setAlunoContrato);
router.post("/getAlunoContratos", getAlunoContratos);
router.post("/getAlunoContrato", getAlunoContrato);

module.exports = router;
