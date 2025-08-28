const { validateToken } = require("./utils/token");
const env = process.env.NODE_ENV || "development";
const dev = env === "development";
const devToken = process.env.DEV_TOKEN;

function verifyToken(req, res, next) {
   // Extract token from "Authorization" header
   const token = req.headers.authorization;

   //If token is not present return error
   if (!token) {
      return res.status(401).send({ status: false, msg: "Token não fornecido!" });
   }

   // Allow development token
   if (dev && token === devToken) {
      next();
      return;
   }

   try {
      // Validate token
      req.validLicense = true;
      const {
         decoded: { status },
      } = validateToken(token);

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

      if (!req.validLicense) {
         // ! Respond with 403 only for non-GET requests
         const routesNotAllowed = ["/setAluno", "/setAlunoContrato"];
         if (routesNotAllowed.includes(req.path)) {
            return res.status(403).send({ status: false, message: req.messageLicense });
         }
         // if (req.method !== "GET") {
         //    return res.status(403).send({ status: false, message: req.messageLicense });
         // }
      }

      next();
   } catch (err) {
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

module.exports = verifyToken;
