import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

const { validateToken } = require("../api/utils/token");
const env = process.env.NODE_ENV || "development";
const dev = env === "development";
const devToken = process.env.DEV_TOKEN;
const getMessageError = require("../utils/errors-message");

const allowedRoutes = [
   "/users/login",
   "/users/refreshToken",
   "/users/register",
   "/users/updatePassword",
   "/users/recoveryAccount",
   "/google/getGoogleUrlLogin",
   "/google/loggedGoogle",
   "/physicalAssessments/fitnessassessmentpdf",
];

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
   use(req: Request & any, res: Response, next: NextFunction) {
      // Allow access to certain routes without token
      if (allowedRoutes.includes(req.path)) {
         return next();
      }

      // Extract token from "Authorization" header
      const params = req.headers.authorization?.split(" ");
      //Remove Bearer if exist
      const token = params ? params[1] ?? (params[0] as string) : null;

      //If token is not present return error
      if (!token) {
         return res.status(401).send({ status: false, msg: getMessageError("INVALID_TOKEN") });
      }

      // Allow development token
      if (dev && token === devToken) {
         req.cod_empresa = 1;
         req.cod_usuario = 1;

         next();
         return;
      }

      try {
         // Validate token
         req.validLicense = true;
         const {
            decoded: { status, cod_empresa, cod_usuario },
         } = validateToken(token);

         req.cod_empresa = cod_empresa;
         req.cod_usuario = cod_usuario;

         // If company is not present
         if (!cod_empresa || !cod_usuario)
            return res.status(401).send({ status: false, msg: getMessageError("INVALID_TOKEN") });

         // ! Check if license expired or cancelled
         if (status === "Expired") {
            req.validLicense = false;
            req.messageLicense = "Licença expirada.";
            // return res.status(403).send({ status: false, message: "Licença expirada." });
         } else if (status === "Cancelled") {
            req.validLicense = false;
            req.messageLicense = "Licença cancelada.";
            // return res.status(403).send({ status: false, message: "Licença cancelada." });
         } else if (!status) {
            req.validLicense = false;
            req.messageLicense = "Limite de alunos cadastrados atingido!";
         }

         next();
      } catch (err: any) {
         if (!dev && token === devToken) {
            console.log("Dev token used on production");
         }
         // Retorna erro se o token for inválido ou expirado
         if (err.name === "TokenExpiredError") {
            return res.status(401).send({ status: false, msg: "Token expirado!" });
         } else if (err.name === "JsonWebTokenError") {
            return res.status(401).send({ status: false, msg: "Token inválido!" });
         }

         return res.status(500).send({ status: false, msg: "Erro ao validar token!" });
      }
   }
}
