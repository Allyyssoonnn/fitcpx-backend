const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
   setPlano,
   getPlanos,
   deletePlano,
   recoveryPlano,
   setModalidade,
   getModalidades,
   deleteModalidade,
   recoveryModalidade,
   getModContratos,
   deleteContrato,
   recoveryContrato,
   setModContrato,
} = require("../controllers/ctrlPlano");

router.post("/setPlano", verifyToken, setPlano);
router.post("/getPlanos", verifyToken, getPlanos);
router.post("/deletePlano", verifyToken, deletePlano);
router.post("/recoveryPlano", verifyToken, recoveryPlano);
router.post("/setModalidade", verifyToken, setModalidade);
router.post("/getModalidades", verifyToken, getModalidades);
router.post("/deleteModalidade", verifyToken, deleteModalidade);
router.post("/recoveryModalidade", verifyToken, recoveryModalidade);
router.post("/getModContratos", verifyToken, getModContratos);
router.post("/setModContrato", verifyToken, setModContrato);
router.post("/deleteContrato", verifyToken, deleteContrato);
router.post("/recoveryContrato", verifyToken, recoveryContrato);

module.exports = router;
