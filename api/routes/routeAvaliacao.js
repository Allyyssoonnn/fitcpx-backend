const router = require("express").Router();
const verifyToken = require("../authMiddleware");
const { getResultPhysicalAssesment } = require("../controllers/ctrlAvaliacao");

router.post("/getResultPhysicalAssesment", getResultPhysicalAssesment);

module.exports = router;
