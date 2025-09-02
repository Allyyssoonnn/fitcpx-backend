class UserService {
   constructor(userRepository) {
      this.userRepository = userRepository;
   }

   getAll = async () => {
      return await this.userRepository.findAll();
   };

   getById = async (id, companyId) => {
      return await this.userRepository.findById(id, companyId);
   };

   create = async (data) => {
      return await this.userRepository.create(data);
   };
}

module.exports = UserService;
