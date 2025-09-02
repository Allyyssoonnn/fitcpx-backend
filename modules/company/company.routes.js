const router = require("express").Router();
const verifyToken = require("../../api/middlewares/authMiddleware");

const CompanyController = require("./company.controller");
const CompanyService = require("./company.service");
const CompanyRepository = require("./company.repository");

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyController(companyService);

router.get("/company", verifyToken, companyController.getAll);
// router.get('/:id', companyController.getCompanyById);
// router.post('/', companyController.createCompany);
// router.put('/:id', companyController.updateCompany);
// router.delete('/:id', companyController.deleteCompany);

module.exports = router;
