import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { CompanyId } from "../../shared/decorators/companyId.decorator";
import { UserId } from "../../shared/decorators/userId.decorator";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Get()
   async getAll(@CompanyId() companyId: string) {
      return this.usersService.getAll(companyId);
   }

   @Get(":id")
   async getById(@Param("id") id: string, @CompanyId() companyId: string) {
      return this.usersService.getById(id, companyId);
   }

   @Post()
   async createOrUpdate(@Body() body: any) {
      return this.usersService.createOrUpdate(body);
   }

   @Post("login")
   async login(@Body() body: { email: string; password: string }) {
      const { email, password } = body;
      return this.usersService.login(email, password);
   }

   @Post("refreshToken")
   async refreshToken(@Body() body: { refreshToken: string }) {
      const { refreshToken } = body;
      return this.usersService.refreshToken(refreshToken);
   }

   @Post("register")
   async register(@Body() body: { name: string; email: string; password: string; phone: string }) {
      const { name, email, password, phone } = body;
      return this.usersService.register(name, email, password, phone);
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

   @Post("updateImageUser")
   @UseInterceptors(
      FileInterceptor("image", {
         storage: multer.memoryStorage(),
      })
   )
   async updateImageUser(@UserId() userId: string, @UploadedFile() fileBuffer: Express.Multer.File) {
      return this.usersService.updateImageUser(userId, fileBuffer);
   }
}
