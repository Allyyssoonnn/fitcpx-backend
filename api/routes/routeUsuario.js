const router = require("express").Router();

const { refreshToken } = require("../controllers/ctrlUsuario");

router.post("/refreshToken", refreshToken);

module.exports = router;
