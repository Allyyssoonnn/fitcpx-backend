const router = require("express").Router();
const { getResultPhysicalAssesment } = require("../controllers/ctrlAvaliacao");

router.post("/getResultPhysicalAssesment", getResultPhysicalAssesment);

module.exports = router;
