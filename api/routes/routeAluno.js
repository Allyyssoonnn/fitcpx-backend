const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");

const {
   getAlunoContratos,
   getAlunoContrato,
   cancelAlunoContrato,
   downloadAlunoContrato,
   resendAlunoContrato,
} = require("../controllers/aluno/ctrlAluno");
const { multerAutentique } = require("../features/autentique");

router.post("/cancelAlunoContrato", verifyToken, cancelAlunoContrato);
router.post("/resendAlunoContrato", verifyToken, multerAutentique(), resendAlunoContrato);
router.post("/downloadAlunoContrato", verifyToken, downloadAlunoContrato);
router.post("/getAlunoContratos", getAlunoContratos);
router.post("/getAlunoContrato", getAlunoContrato);

module.exports = router;
