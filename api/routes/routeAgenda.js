const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const { getAgenda, setAgenda, getAvaliableEvents } = require("../controllers/ctrlAgenda");

router.post("/getAgenda", verifyToken, getAgenda);
router.post("/getAvaliableEvents", verifyToken, getAvaliableEvents);
router.post("/setAgenda", verifyToken, setAgenda);

module.exports = router;
