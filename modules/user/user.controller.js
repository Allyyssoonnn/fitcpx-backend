class UserController {
   constructor(userService) {
      this.userService = userService;
   }

   getAll = async (req, res, next) => {
      try {
         const users = await this.userService.getAll();
         res.json(users);
      } catch (error) {
         next(error);
      }
   };

   getById = async (req, res, next) => {
      try {
         const { id } = req.params;
         const { cod_empresa } = req;
         const user = await this.userService.getById(id, cod_empresa);
         res.json(user);
      } catch (error) {
         next(error);
      }
   };

   create = async (req, res, next) => {
      try {
         const user = await this.userService.create(req.body);
         res.json(user);
      } catch (error) {
         next(error);
      }
   };

   login = async (req, res, next) => {
      try {
         const { email, password } = req.body;
         const data = await this.userService.login(email, password);
         res.json(data);
      } catch (error) {
         next(error);
      }
   };

   register = async (req, res, next) => {
      try {
         const { name, email, password } = req.body;
         const data = await this.userService.register(name, email, password);
         res.json(data);
      } catch (error) {
         next(error);
      }
   };
}

module.exports = UserController;
