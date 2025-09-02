class CompanyService {
   constructor(companyRepository) {
      this.companyRepository = companyRepository;
   }

   async getAll() {
      return await this.companyRepository.findAll();
   }
}

module.exports = CompanyService;
