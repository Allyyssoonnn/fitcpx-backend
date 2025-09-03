const router = require("express").Router();
const verifyToken = require("../../api/middlewares/authMiddleware");

const StudentController = require("./students.controller");
const StudentService = require("./students.service");
const StudentRepository = require("./students.repository");

const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);
const studentController = new StudentController(studentService);

router.get("/students", verifyToken, studentController.getAll);
router.get("/students/:id", verifyToken, studentController.getById);
// router.post('/', companyController.createCompany);
// router.put('/:id', companyController.updateCompany);
// router.delete('/:id', companyController.deleteCompany);

module.exports = router;
