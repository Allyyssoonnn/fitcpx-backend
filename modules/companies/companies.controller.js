const Response = require("../../core/response");

class CompanyController {
   constructor(companyService) {
      this.companyService = companyService;
   }

   getAll = async (req, res, next) => {
      try {
         const companies = await this.companyService.getAll();
         Response.success(res, companies);
      } catch (error) {
         next(error);
      }
   };
}

module.exports = CompanyController;
