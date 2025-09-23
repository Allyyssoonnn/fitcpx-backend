const router = require("express").Router();
const { login, refreshToken, finishTreino } = require("../controllers/ctrlAppAluno");

router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.post("/finishTreino", finishTreino);

module.exports = router;
