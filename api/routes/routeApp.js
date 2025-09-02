const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const { getNotifications, sendFeedback, getDashboard } = require("../controllers/ctrlApp");

router.post("/getNotifications", verifyToken, getNotifications);
router.post("/sendFeedback", verifyToken, sendFeedback);
router.get("/getDashboard", verifyToken, getDashboard);

module.exports = router;
