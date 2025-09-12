const router = require("express").Router();

const verifyToken = require("../middlewares/authMiddleware");

const {
   refreshToken,
   getProtocolos,
   changeUsuarioIMG,
   setUsuario,
   getUsuarios,
   recovery,
   loginGoogle,
   loggedGoogle,
   setEmpresa,
   verifyTokenRecovery,
   changePassword,
   getEmpresa,
} = require("../controllers/ctrlUsuario");
const { uploadIMGUsuario, uploadIMGEmpresa } = require("../features/aws");

router.get("/loginGoogle", loginGoogle);
router.post("/loggedGoogle", loggedGoogle);

router.post("/verifyTokenRecovery", verifyTokenRecovery);
router.post("/changePassword", changePassword);
router.post("/refreshToken", refreshToken);
router.post("/getProtocolos", getProtocolos);
router.post("/getUsuarios", verifyToken, getUsuarios);
router.post("/setUsuario", verifyToken, setUsuario);
router.post("/getEmpresa", verifyToken, getEmpresa);
router.post("/setEmpresa", verifyToken, setEmpresa);

router.post("/changeUsuarioIMG", uploadIMGUsuario);
router.post("/changeEmpresaIMG", uploadIMGEmpresa);

module.exports = router;
