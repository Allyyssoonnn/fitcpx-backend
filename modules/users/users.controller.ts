import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CompanyId } from "../../decorators/companyId.decorator";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Get()
   async getAll() {
      return this.usersService.getAll();
   }

   @Get(":id")
   async getById(@Param("id") id: string, @CompanyId() companyId: string) {
      return this.usersService.getById(id, companyId);
   }

   @Post()
   async create(@Body() body: any) {
      return this.usersService.create(body);
   }

   @Post("login")
   async login(@Body() body: { email: string; password: string }) {
      const { email, password } = body;
      return this.usersService.login(email, password);
   }

   @Post("register")
   async register(@Body() body: { name: string; email: string; password: string }) {
      const { name, email, password } = body;
      return this.usersService.register(name, email, password);
   }

   @Post("recoveryAccount")
   async recoveryAccount(@Body() body: { email: string }) {
      const { email } = body;
      return this.usersService.recoveryAccount(email);
   }

   @Post("updatePassword")
   async updatePassword(@Body() body: { token: string; password: string }) {
      const { token, password } = body;
      return this.usersService.updatePassword(token, password);
   }

   @Post("resendConfirmationCode")
   async resendConfirmationCode(@CompanyId() companyId: string) {
      return await this.usersService.resendConfirmationCode(companyId);
   }
}
