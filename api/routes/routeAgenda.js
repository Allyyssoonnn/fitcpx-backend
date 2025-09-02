const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
   getAgenda,
   setAgenda,
   conectGoogle,
   conectedGoogle,
   getGoogleConnect,
   syncGoogleEvents,
   getAvaliableEvents,
} = require("../controllers/ctrlAgenda");

router.post("/getAgenda", verifyToken, getAgenda);
router.post("/getAvaliableEvents", verifyToken, getAvaliableEvents);
router.post("/setAgenda", verifyToken, setAgenda);
router.get("/conectGoogle", verifyToken, conectGoogle);
router.post("/conectedGoogle", verifyToken, conectedGoogle);
router.post("/getGoogleConnect", verifyToken, getGoogleConnect);
router.post("/syncGoogleEvents", verifyToken, syncGoogleEvents);

module.exports = router;
