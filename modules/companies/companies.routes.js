const router = require("express").Router();
const verifyToken = require("../../api/middlewares/authMiddleware");

const CompanyController = require("./companies.controller");
const CompanyService = require("./companies.service");
const CompanyRepository = require("./companies.repository");

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyController(companyService);

router.get("/companies", verifyToken, companyController.getAll);
// router.get('/:id', companyController.getCompanyById);
// router.post('/', companyController.createCompany);
// router.put('/:id', companyController.updateCompany);
// router.delete('/:id', companyController.deleteCompany);

module.exports = router;
