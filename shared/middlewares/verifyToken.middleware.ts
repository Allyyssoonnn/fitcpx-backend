import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/token";
import { validateStudentToken } from "../utils/token.mobile";

const env = process.env.NODE_ENV || "development";
const dev = env === "development";
const devToken = process.env.DEV_TOKEN;
const getMessageError = require("../utils/errors-message");

const allowedRoutes = [
   "/companies/cancelCompanyLicense",
   "/wp/test",
   "/admin/sendNotify",
   "/admin/resetTrial",
   "/admin/createOrEditLicenses",
   "/admin/getLicenses",
   "/admin/getClientInfo",
   "/admin/getClientsCount",
   "/crm/createOrEditAutomation",
   "/crm/createOrEditStage",
   "/crm/onSendFeedback",
   "/crm/deleteStage",
   "/crm/reorderStages",
   "/crm/deleteAutomation",
   "/crm/getAutomations",
   "/crm/getStages",
   "/crm/getPipelines",
   "/crm/onChangeStep",
   "/admin/getClient",
   "/admin/clients",
   "/admin/test",
   "/metrics",
   "/admin/sendCoupon",
   "/admin/getRefreshTokens",
   "/admin/getNewClientsDashboard",
   "/admin/getFinanceDashboard",
   "/admin/getLicensesClients",
   "/admin/printPayout",
   "/events/confirmedPayment",
   "/events/createdPayment",
   "/events/overduePayment",
   "/events/license/confirmedPayment",
   "/events/license/createdPayment",
   "/events/license/overduePayment",
   "/notifications",
   "/mails",
   "/mails/payout",
   "/mobile/verifyAccount",
   "/mobile/recoveryPassword",
   "/mobile/login",
   "/mobile/refreshToken",
   "/users/login",
   "/users/refreshToken",
   "/users/register",
   "/users/updatePassword",
   "/students/updatePassword",
   "/users/recoveryAccount",
   "/google/getGoogleUrlLogin",
   "/google/loggedGoogle",
   "/physicalAssessments/fitnessassessmentpdf",
   "/licenses/buyLicense",
   "/licenses/sendCoupon",
   "/companies",
];

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
   use(req: Request & any, res: Response, next: NextFunction) {
      // Extract token from "Authorization" header
      const params = req.headers.authorization?.split(" ");
      //Remove Bearer if exist
      const token = params ? params[1] ?? (params[0] as string) : null;

      // Allow access to certain routes without token
      if (allowedRoutes.includes(req.path) && !token) {
         return next();
      }

      //If token is not present return error
      if (!token) {
         return res.status(401).send({ status: false, msg: getMessageError("INVALID_TOKEN") });
      }

      // Allow development token
      if (dev && token === devToken) {
         req.cod_empresa = 1;
         req.cod_usuario = 1;

         return next();
      }

      //Verify Mobile app
      if (req.path.split("/")[1] === "mobile") {
         try {
            const {
               decoded: { cod_empresa, cod_aluno },
            } = validateStudentToken(token);

            req.cod_empresa = cod_empresa;
            req.cod_aluno = cod_aluno;

            if (!cod_empresa || !cod_aluno) throw new HttpException(getMessageError("INVALID_TOKEN"), 401);

            return next();
         } catch (err: any) {
            if (err.name === "TokenExpiredError") {
               throw new HttpException("Token expirado", 401);
            } else if (err.name === "JsonWebTokenError") {
               throw new HttpException("Token inválido", 401);
            }

            return res.status(500).send({ status: false, msg: "Erro ao validar token!" });
         }
      }

      try {
         const {
            decoded: { status, cod_empresa, cod_usuario },
         } = validateToken(token);

         req.cod_empresa = cod_empresa;
         req.cod_usuario = cod_usuario;

         // If company is not present
         if (!cod_empresa || !cod_usuario) throw new HttpException(getMessageError("INVALID_TOKEN"), 401);

         if (allowedRoutes.includes(req.path)) return next();

         // ! Check if license expired or cancelled
         if (status === "Expired") {
            if (req.method === "POST") return res.status(403).send({ status: false, message: "Licença expirada." });
         } else if (status === "Canceled") {
            if (req.method === "POST") return res.status(403).send({ status: false, message: "Licença cancelada." });
         } else if (status === "Trial Expired") {
            if (req.method === "POST")
               return res.status(403).send({ status: false, message: "Teste gratuito expirado." });
         } else if (!status) {
            return res.status(401).send({ status: false, message: "Licença inválida." });
         }

         next();
      } catch (err: any) {
         if (!dev && token === devToken) {
            console.log("Dev token used on production");
         }
         // Retorna erro se o token for inválido ou expirado
         if (err.name === "TokenExpiredError") {
            throw new HttpException("Token expirado", 401);
         } else if (err.name === "JsonWebTokenError") {
            throw new HttpException("Token inválido", 401);
         }

         return res.status(500).send({ status: false, msg: "Erro ao validar token!" });
      }
   }
}
