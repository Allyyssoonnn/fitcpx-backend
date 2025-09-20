import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Express } from "express";
import { AppModule } from "./app.module";
import { VerifyTokenMiddleware } from "./shared/middlewares/verifyToken.middleware";

export async function bootstrap(expressApp?: Express): Promise<INestApplication> {
   if (expressApp) {
      // usar Express já existente
      const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
         cors: true,
      });
      app.use(new VerifyTokenMiddleware().use);
      await app.init();
      console.log("NestJS | montado junto do Express");
      return app;
   } else {
      // fallback -> Nest cria seu próprio express
      const app = await NestFactory.create(AppModule, {
         cors: true,
      });
      app.use(new VerifyTokenMiddleware().use);
      await app.listen(8071);
      console.log("NestJS | rodando sozinho em http://localhost:8071");
      return app;
   }
}
