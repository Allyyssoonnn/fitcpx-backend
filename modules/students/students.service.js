class StudentService {
   constructor(studentRepository) {
      this.studentRepository = studentRepository;
   }

   async getAll(companyId, onlyDeleted) {
      return await this.studentRepository.findAll(companyId, onlyDeleted);
   }

   async getById(id, companyId) {
      return await this.studentRepository.findById(id, companyId);
   }
}

module.exports = StudentService;
