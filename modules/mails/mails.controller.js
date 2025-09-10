const Response = require("../../core/response");

class MailController {
   constructor(mailService) {
      this.mailService = mailService;
   }

   test = async (req, res, next) => {
      try {
         const { email } = req.query;
         await this.mailService.test(email);
         Response.success(res);
      } catch (error) {
         next(error);
      }
   };

   payout = async (req, res, next) => {
      try {
         const { name, email, clients, amount, startDate, endDate } = req.body;
         const fileBuffer = req.file.buffer;
         await this.mailService.payout(name, email, clients, amount, fileBuffer, startDate, endDate);
         Response.success(res);
      } catch (error) {
         next(error);
      }
   };
}

module.exports = MailController;
