const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const { getResultPhysicalAssesment } = require("../controllers/ctrlAvaliacao");

router.post("/getResultPhysicalAssesment", verifyToken, getResultPhysicalAssesment);

module.exports = router;
