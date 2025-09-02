const router = require("express").Router();
const UserController = require("./user.controller");
const UserService = require("./user.service");
const UserRepository = require("./user.repository");
const verifyToken = require("../../api/middlewares/authMiddleware");

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/user", verifyToken, userController.getAll);
router.get("/user/:id", verifyToken, userController.getById);
router.post("/user", verifyToken, userController.create);
router.post("/login", userController.login);
router.post("/register", userController.register);

module.exports = router;
