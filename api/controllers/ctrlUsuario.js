const { tab_usuario, tab_empresa, tab_protocolo, tab_refreshtoken_usuario } = require("../../database/models");
const crypto = require("crypto");
const { Sequelize, where, Op } = require("sequelize");
const { genTokenUserAuth, genTokenUserRecoveryPassword, validateToken } = require("../utils/token");
const env = process.env.NODE_ENV || "development";
const dev = env === "development";
const devToken = process.env.DEV_TOKEN;

async function refreshToken(req, res) {
   const { refreshToken } = req.body;

   if (dev && refreshToken === devToken) {
      const usuario = await tab_usuario.findOne({ where: { cod_usuario: 1 } });
      const empresa = usuario?.cod_empresa
         ? await tab_empresa.findOne({ where: { cod_empresa: usuario.cod_empresa } })
         : null;

      res.send({ status: true, token: refreshToken, usuario, empresa });
      return;
   }

   if (!refreshToken) return res.status(403).send({ status: false, msg: "Token de atualização não fornecido!" });

   const refreshTokenValido = await tab_refreshtoken_usuario.findOne({
      where: {
         refreshtoken_usuario: refreshToken,
         expiresAt: {
            [Op.gte]: new Date(),
         },
      },
   });

   const refreshTokenExpirado = await tab_refreshtoken_usuario.findOne({
      where: {
         refreshtoken_usuario: refreshToken,
         expiresAt: {
            [Op.lt]: new Date(), // Verifica se a data de expiração é menor que a data atual
         },
      },
   });
   if (refreshTokenExpirado)
      await tab_refreshtoken_usuario.update(
         { deletedAt: new Date() },
         { where: { cod_refreshtoken_usuario: refreshTokenExpirado.cod_refreshtoken_usuario } }
      );

   if (!refreshTokenValido) {
      return res.status(403).send({ status: false, msg: "Token inválido!" });
   }

   const usuario = await tab_usuario.findOne({ where: { cod_usuario: refreshTokenValido.cod_usuario } });
   const empresa = await tab_empresa.findOne({ where: { cod_empresa: usuario.cod_empresa } });

   const { token } = await genTokenUserAuth(usuario.cod_usuario, empresa.cod_empresa);
   const {
      decoded: { status },
   } = validateToken(token);
   const validLicense = status !== "Expired" && status !== "Cancelled" && status !== undefined && status !== null;
   res.send({ status: true, token, usuario, empresa, validLicense });
}

module.exports = {
   refreshToken,
};
