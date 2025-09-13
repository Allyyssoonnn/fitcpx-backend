const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");

const {
   setAvaliacao,
   getAvaliacao,
   recoveryAluno,
   getAvaliacoes,
   deleteAvaliacao,
   setAlunoContrato,
   getAlunoContratos,
   getAlunoContrato,
   sendAlunoContrato,
   cancelAlunoContrato,
   downloadAlunoContrato,
   resendAlunoContrato,
} = require("../controllers/aluno/ctrlAluno");
const { uploadIMGAvaliacao } = require("../features/aws");
const { multerAutentique } = require("../features/autentique");

router.post("/recoveryAluno", verifyToken, recoveryAluno);
router.post("/getAvaliacoes", getAvaliacoes);
router.post("/getAvaliacao", getAvaliacao);
router.post("/setAvaliacao", verifyToken, setAvaliacao);
router.post("/deleteAvaliacao", verifyToken, deleteAvaliacao);
router.post("/setAlunoContrato", verifyToken, setAlunoContrato);
router.post("/cancelAlunoContrato", verifyToken, cancelAlunoContrato);
router.post("/sendAlunoContrato", verifyToken, multerAutentique(), sendAlunoContrato);
router.post("/resendAlunoContrato", verifyToken, multerAutentique(), resendAlunoContrato);
router.post("/downloadAlunoContrato", verifyToken, downloadAlunoContrato);
router.post("/getAlunoContratos", getAlunoContratos);
router.post("/getAlunoContrato", getAlunoContrato);

router.post("/sendAvaliacaoIMG", uploadIMGAvaliacao);

module.exports = router;
