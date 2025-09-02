const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const { uploadIMGAlimento } = require("../features/aws");
const {
   getAlimentos,
   getGrupoAlimentos,
   setGrupoAlimento,
   deleteGrupoAlimento,
   recoveryGrupoAlimento,
   deleteAlimento,
   recoveryAlimento,
   setAlimento,
   setCardapio,
   setRefeicao,
   getCardapios,
   deleteCardapio,
   recoveryCardapio,
} = require("../controllers/ctrlCardapio");

router.post("/getCardapios", verifyToken, getCardapios);
router.post("/setCardapio", verifyToken, setCardapio);
router.post("/setRefeicao", verifyToken, setRefeicao);
router.post("/deleteCardapio", verifyToken, deleteCardapio);
router.post("/recoveryCardapio", verifyToken, recoveryCardapio);

router.post("/getAlimentos", verifyToken, getAlimentos);
router.post("/setAlimento", verifyToken, setAlimento);
router.post("/changeAlunoIMG", uploadIMGAlimento);
router.post("/deleteAlimento", verifyToken, deleteAlimento);
router.post("/recoveryAlimento", verifyToken, recoveryAlimento);
router.post("/getGrupoAlimentos", verifyToken, getGrupoAlimentos);
router.post("/setGrupoAlimento", verifyToken, setGrupoAlimento);
router.post("/deleteGrupoAlimento", verifyToken, deleteGrupoAlimento);
router.post("/recoveryGrupoAlimento", verifyToken, recoveryGrupoAlimento);

module.exports = router;
