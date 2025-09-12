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

async function getUsuarios(req, res) {
   const { cod_empresa, deleted } = req.body;
   const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
   const usuarios = await tab_usuario.findAll({
      where: { cod_empresa: cod_empresa, ...where },
      attributes: { exclude: ["refreshToken"] },
      paranoid: !deleted,
   });
   res.send({ status: true, usuarios });
}

async function setUsuario(req, res) {
   const { usuario } = req.body;
   var usuarioAtt;

   if (usuario?.cod_usuario) usuarioAtt = await tab_usuario.findOne({ where: { cod_usuario: usuario.cod_usuario } });

   if (usuarioAtt) {
      const user = await tab_usuario.update(usuario, { where: { cod_usuario: usuario.cod_usuario } });
      usuarioAtt = await tab_usuario.findOne({ where: { cod_usuario: usuario.cod_usuario } });
   } else {
      const novoUsuario = await tab_usuario.create(usuario);
      usuarioAtt = novoUsuario;
   }

   res.send({ status: true, usuario: usuarioAtt });
}

async function getEmpresa(req, res) {
   const { cod_empresa } = req.body;
   const empresa = await tab_empresa.findAll({
      where: { cod_empresa: cod_empresa },
      attributes: { exclude: ["apikey_empresa", "walletid_empresa"] },
   });
   res.send({ status: true, empresa });
}

async function setEmpresa(req, res) {
   const { empresa } = req.body;
   var empresaAtt;

   if (empresa?.cod_empresa)
      empresaAtt = await tab_empresa.findOne({
         where: { cod_empresa: empresa.cod_empresa },
         attributes: {
            exclude: ["apikey_empresa", "walletid_empresa", "stripe_customer_id", "dev_stripe_id", "stripe_id"],
         },
      });

   if (empresaAtt) {
      await tab_empresa.update(empresa, { where: { cod_empresa: empresa.cod_empresa } });
      empresaAtt = await tab_empresa.findOne({
         where: { cod_empresa: empresa.cod_empresa },
         attributes: {
            exclude: ["apikey_empresa", "walletid_empresa", "stripe_customer_id", "dev_stripe_id", "stripe_id"],
         },
      });

      const empresaBD = await tab_empresa.findOne({ where: { cod_empresa: empresa.cod_empresa } });
      const accountId = env === "development" ? empresaBD.dev_stripe_id : empresaBD.stripe_id;
      // if (accountId) await updateAccount(empresaAtt, accountId);
   } else {
      const novaEmpresa = await tab_empresa.create(empresa);
      empresaAtt = novaEmpresa;
   }

   res.send({ status: true, empresa: empresaAtt });
}

module.exports = {
   refreshToken,
   getUsuarios,
   setUsuario,
   getEmpresa,
   setEmpresa,
};
