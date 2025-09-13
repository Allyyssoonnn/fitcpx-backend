const multerS3 = require("multer-s3");
const multer = require("multer");
const { tab_avaliacao_imagem, tab_usuario, tab_aluno, tab_alimento, tab_empresa } = require("../../database/models");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const env = process.env.NODE_ENV || "development";
const dev = env === "development";

function getS3Client() {
   // Configuração do cliente S3
   const s3Client = new S3Client({
      region: "sa-east-1", // Substitua pela região do seu bucket, como 'us-east-1'
      credentials: {
         accessKeyId: "[REDACTED_CREDENTIAL]", // Substitua pela sua Access Key
         secretAccessKey: "[REDACTED_CREDENTIAL]", // Substitua pela sua Secret Key
      },
      requestHandler: {
         metadata: { timeout: 300000 }, // 5 minutos
      },
   });

   return s3Client;
}

// Configuração do Multer com armazenamento no S3
function uploadDinamico(folder) {
   return multer({
      storage: multerS3({
         s3: getS3Client(),
         bucket: "media.fitcpx.com",
         acl: "public-read",
         contentType: multerS3.AUTO_CONTENT_TYPE, // Mantém o tipo correto
         key: function (req, file, cb) {
            const fileName = `${Date.now()}_${file.originalname}`;
            cb(null, `${dev ? "developer/" : ""}${folder}/${fileName}`);
         },
      }),
      // limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
   });
}

async function uploadIMGAvaliacao(req, res) {
   const deletedimages = JSON.parse(req?.headers["deletedimages"]);

   if (Array.isArray(deletedimages)) {
      for (const imageData of deletedimages) {
         const id = imageData.split("/")[imageData.split("/").length - 1];
         const removida = await deleteIMG("aluno/avaliacao", id);
         if (removida) tab_avaliacao_imagem.update({ deletedAt: new Date() }, { where: { url_imagem: imageData } });
      }
   }

   const upload = uploadDinamico("aluno/avaliacao").array("image", 15);

   upload(req, res, async (err) => {
      if (err) {
         console.log(err);
         return res.status(400).json({ error: err.message });
      }

      // Criar array de URLs públicas dos arquivos
      const imagensSalvas = req.files.map((file, index) => ({
         url_imagem: `https://media.fitcpx.com/${file.key}`, // 📌 file.location já tem a publicUrl do S3
         descricao_imagem: file.originalname.split("[")[1].split("]")[0],
         tamanho_imagem: file.originalname.split("(")[1].split(")")[0],
         cod_avaliacao: req.headers["cod_avaliacao"], // Pegando código da avaliação do header
      }));

      // Salvar URLs no banco de dados
      try {
         await tab_avaliacao_imagem.bulkCreate(imagensSalvas);
         res.send({ status: true, imagens: imagensSalvas });
      } catch (dbError) {
         console.error("Erro ao salvar no banco:", dbError);
         res.send({ error: "Erro ao salvar no banco de dados" });
      }
   });
}

module.exports = {
   uploadIMGAvaliacao,
};
