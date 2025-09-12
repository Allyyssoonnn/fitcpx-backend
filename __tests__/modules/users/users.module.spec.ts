import { MailsAPI } from "../../../modules/mails/mails.api";
import { MailsService } from "../../../modules/mails/mails.service";
import { UsersController } from "../../../modules/users/users.controller";
import { UsersRepository } from "../../../modules/users/users.repository";
import { UsersService } from "../../../modules/users/users.service";

describe("Jest:Users Module", () => {
   let controller: UsersController;
   let service: UsersService;
   let repository: UsersRepository;

   beforeEach(() => {
      repository = new UsersRepository();
      service = new UsersService(repository, new MailsService(new MailsAPI()));
      controller = new UsersController(service);
   });

   const userTest = {
      name: "Test",
      email: "alysonone123@gmail.com",
      password: "12345",
   };

   test("post:users", async () => {
      const newUser = await controller.register(userTest);
      const { token, refreshToken } = newUser;
      expect(newUser).toBeDefined();
      expect(!!(token && refreshToken)).toBe(true);
   });

   test("get:users", async () => {
      const users = await controller.getAll();
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
   });

   test("get:users:id", async () => {
      const users = await controller.getById("1", "1");
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
   });
});
