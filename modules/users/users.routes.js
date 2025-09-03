const router = require("express").Router();
const UserController = require("./users.controller");
const UserService = require("./users.service");
const UserRepository = require("./users.repository");
const verifyToken = require("../../api/middlewares/authMiddleware");

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/users", verifyToken, userController.getAll);
router.get("/users/:id", verifyToken, userController.getById);
router.post("/users", verifyToken, userController.create);
router.post("/login", userController.login);
router.post("/register", userController.register);

module.exports = router;
