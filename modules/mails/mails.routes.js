const router = require("express").Router();
const { uploadStorage } = require("../../api/middlewares/multer.storage");
const MailController = require("./mails.controller");
const MailService = require("./mails.service");

const mailService = new MailService();
const mailController = new MailController(mailService);

router.get("/sendMail/test", mailController.test);
router.post("/sendMail/payout", uploadStorage.single("proof"), mailController.payout);

module.exports = router;
