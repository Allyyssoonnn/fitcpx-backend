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
   async getById(@Param("id") id: string, @CompanyId() cod_empresa: string) {
      return this.usersService.getById(id, cod_empresa);
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

   // login = async (req, res, next) => {
   //    try {
   //       const { email, password } = req.body;
   //       const data = await this.userService.login(email, password);
   //       Response.success(res, data);
   //    } catch (error) {
   //       next(error);
   //    }
   // };

   // register = async (req, res, next) => {
   //    try {
   //       const { name, email, password } = req.body;
   //       const data = await this.userService.register(name, email, password);
   //       Response.created(res, data);
   //    } catch (error) {
   //       next(error);
   //    }
   // };
}
