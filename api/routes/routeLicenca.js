const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const { getLicencas, getLicenca, cancelLicenca, buyLicenca, getPayments } = require("../controllers/ctrlLicenca");

router.get("/getLicencas", verifyToken, getLicencas);
router.post("/getLicenca", verifyToken, getLicenca);
router.post("/buyLicenca", verifyToken, buyLicenca);
router.post("/cancelLicenca", verifyToken, cancelLicenca);
router.post("/getPayments", verifyToken, getPayments);

module.exports = router;
