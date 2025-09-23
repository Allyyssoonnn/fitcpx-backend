const { tab_refreshtoken_usuario, tab_empresa_licenca, tab_empresa } = require("../../database/models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// * Generate JWT and Refresh Token when user logs in
// * Token expiration in 7 hours
// * Refresh Token expiration in 7 days
export async function genTokenUserAuth(cod_usuario: string, cod_empresa: string, req: any = null) {
   // * Fetch latest license and payment for the company
   const company = await tab_empresa.findByPk(cod_empresa, {
      include: [
         {
            model: tab_empresa_licenca,
            as: "licenses",
            limit: 1,
            order: [["createdAt", "DESC"]],
            separate: true,
         },
      ],
   });
   const license = company?.licenses[0];

   const { status_empresa_licenca: status } = license || {};
   // * Status can be "Active", "Expired", "Cancelled", null (no license)

   const token = jwt.sign({ cod_usuario, status, cod_empresa }, process.env.SECRET, { expiresIn: "7h" });

   const refreshToken = crypto.randomBytes(64).toString("hex");

   // * Save refreshToken in database
   const expirationTime = 7 * 24 * 60 * 60 * 1000; // * 7 days
   const expiresAt = new Date(Date.now() + expirationTime);

   tab_refreshtoken_usuario.create({
      cod_usuario: cod_usuario,
      refreshtoken_usuario: refreshToken,
      useragent_usuario: req?.headers["user-agent"] ?? null,
      ip_usuario: req?.connection?.remoteAddress ?? null,
      expiresAt: expiresAt,
   });

   return { token, refreshToken };
}

// * Generate Token for Password Recovery url
// * Token expiration in 1 hour
export function genTokenUserRecoveryPassword(cod_usuario: string) {
   const token = jwt.sign({ cod_usuario }, process.env.SECRET, { expiresIn: "1h" });
   return token;
}

// * Validate Token
export function validateToken(token: string) {
   const decoded = jwt.verify(token, process.env.SECRET);
   return { valid: true, decoded };
}
