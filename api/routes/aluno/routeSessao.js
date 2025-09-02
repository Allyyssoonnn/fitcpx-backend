const router = require("express").Router();
const {
   setAlunoSessaoPacote,
   createPaySessao,
   getAlunoSessaoPacote,
   getAlunoSessoesPacote,
} = require("../../controllers/aluno/ctrlSessao");
const verifyToken = require("../../middlewares/authMiddleware");

router.post("/setAlunoSessaoPacote", verifyToken, setAlunoSessaoPacote);
router.post("/createPaySessao", verifyToken, createPaySessao);
router.post("/getAlunoSessoesPacote", verifyToken, getAlunoSessoesPacote);
router.post("/getAlunoSessaoPacote", verifyToken, getAlunoSessaoPacote);

module.exports = router;
