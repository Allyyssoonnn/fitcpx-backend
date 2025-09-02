class CompanyController {
   constructor(companyService) {
      this.companyService = companyService;
   }

   getAll = async (req, res, next) => {
      try {
         const companies = await this.companyService.getAll();
         res.json(companies);
      } catch (error) {
         next(error);
      }
   };
}

module.exports = CompanyController;
