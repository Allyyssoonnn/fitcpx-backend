import { Body, Controller, Get, Post } from "@nestjs/common";
import { GoogleService } from "./google.service";

@Controller("google")
export class GoogleController {
   constructor(private readonly googleService: GoogleService) {}

   @Get("getGoogleUrlLogin")
   async getGoogleUrlLogin() {
      return this.googleService.getGoogleUrlLogin();
   }

   @Post("loggedGoogle")
   async loggedGoogle(@Body() body: { code: string }) {
      const { code } = body;
      return this.googleService.loggedGoogle(code);
   }
}
