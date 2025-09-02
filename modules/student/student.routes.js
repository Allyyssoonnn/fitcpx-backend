const router = require("express").Router();
const verifyToken = require("../../api/middlewares/authMiddleware");

const StudentController = require("./student.controller");
const StudentService = require("./student.service");
const StudentRepository = require("./student.repository");

const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);
const studentController = new StudentController(studentService);

router.get("/student", verifyToken, studentController.getAll);
router.get("/student/:id", verifyToken, studentController.getById);
// router.post('/', companyController.createCompany);
// router.put('/:id', companyController.updateCompany);
// router.delete('/:id', companyController.deleteCompany);

module.exports = router;
