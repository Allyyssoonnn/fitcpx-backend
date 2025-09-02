const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const { login, refreshToken, finishTreino, getTreinosRealizados } = require("../controllers/ctrlAppAluno");

router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.post("/finishTreino", finishTreino);
router.post("/getTreinosRealizados", verifyToken, getTreinosRealizados);

module.exports = router;
