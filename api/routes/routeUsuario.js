const router = require("express").Router();

const verifyToken = require("../middlewares/authMiddleware");

const {
   refreshToken,
   changeUsuarioIMG,
   setUsuario,
   getUsuarios,
   setEmpresa,
   getEmpresa,
} = require("../controllers/ctrlUsuario");
const { uploadIMGUsuario, uploadIMGEmpresa } = require("../features/aws");

router.post("/refreshToken", refreshToken);
router.post("/getUsuarios", verifyToken, getUsuarios);
router.post("/setUsuario", verifyToken, setUsuario);
router.post("/getEmpresa", verifyToken, getEmpresa);
router.post("/setEmpresa", verifyToken, setEmpresa);

router.post("/changeUsuarioIMG", uploadIMGUsuario);
router.post("/changeEmpresaIMG", uploadIMGEmpresa);

module.exports = router;
