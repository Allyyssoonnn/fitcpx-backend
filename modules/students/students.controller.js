const Response = require("../../core/response");

class StudentController {
   constructor(studentService) {
      this.studentService = studentService;
   }

   getAll = async (req, res, next) => {
      try {
         const { deleted } = req.query;
         const { cod_empresa } = req;
         const students = await this.studentService.getAll(cod_empresa, deleted == "true");
         Response.success(res, students);
      } catch (error) {
         next(error);
      }
   };

   getById = async (req, res, next) => {
      try {
         const { id } = req.params;
         const { cod_empresa } = req;
         const student = await this.studentService.getById(id, cod_empresa);
         Response.success(res, student);
      } catch (error) {
         next(error);
      }
   };
}

module.exports = StudentController;
