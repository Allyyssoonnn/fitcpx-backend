const multerS3 = require("multer-s3");
const multer = require("multer");
const { tab_avaliacao_imagem, tab_usuario, tab_aluno, tab_alimento, tab_empresa } = require('../database/models');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require("@aws-sdk/lib-storage");

function getS3Client() {
    // Configuração do cliente S3
    const s3Client = new S3Client({
        region: 'us-east-2', // Substitua pela região do seu bucket, como 'us-east-1'
        credentials: {
            accessKeyId: '[REDACTED_CREDENTIAL]', // Substitua pela sua Access Key
            secretAccessKey: '[REDACTED_CREDENTIAL]', // Substitua pela sua Secret Key
        },
        requestHandler: {
            metadata: { timeout: 300000 } // 5 minutos
        }
    });
    
    return s3Client;
}

// Configuração do Multer com armazenamento no S3
function uploadDinamico(folder) {
    return multer({
        storage: multerS3({
            s3: getS3Client(),
            bucket: 'apppersonalfit',
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE, // Mantém o tipo correto
            key: function (req, file, cb) {
                const fileName = `${Date.now()}_${file.originalname}`;
                cb(null, `${folder}/${fileName}`);
            },
        }),
        // limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
    });
}

async function uploadIMGAvaliacao(req, res) {
    const deletedimages = JSON.parse(req?.headers['deletedimages']);

    if (Array.isArray(deletedimages)) {
        for (const imageData of deletedimages) {
            const id = imageData.split('/')[imageData.split('/').length - 1];
            const removida = await deleteIMG('aluno/avaliacao' ,id);
            if (removida) tab_avaliacao_imagem.update({ deletedAt: new Date() }, { where: { url_imagem: imageData } });
        }
    }

    const upload = uploadDinamico('aluno/avaliacao').array('image', 15);

    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });

        // Criar array de URLs públicas dos arquivos
        const imagensSalvas = req.files.map((file, index) => ({
            url_imagem: file.location,  // 📌 file.location já tem a publicUrl do S3
            descricao_imagem: (file.originalname.split('[')[1]).split(']')[0],
            tamanho_imagem: (file.originalname.split('(')[1]).split(')')[0],
            cod_avaliacao: req.headers["cod_avaliacao"] // Pegando código da avaliação do header
        }));

        // Salvar URLs no banco de dados
        try {
            await tab_avaliacao_imagem.bulkCreate(imagensSalvas);
            res.send({ status: true, imagens: imagensSalvas });
        } catch (dbError) {
            console.error("Erro ao salvar no banco:", dbError);
            res.send({ error: "Erro ao salvar no banco de dados" });
        }
    })
}

async function uploadIMGUsuario(req, res) {
    const cod_usuario = req.headers['cod_usuario'];
    const usuario = await tab_usuario.findOne({ where: { cod_usuario } });

    if (usuario?.imagem_usuario) {
        if (usuario?.imagem_usuario?.includes('amazonaws.com')) {
            const id = usuario.imagem_usuario.split('/')[usuario.imagem_usuario.split('/').length - 1];
            const removida = await deleteIMG(id);
        }
    }

    const upload = uploadDinamico('usuario/perfil').array('image', 15);

    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });

        try {
            usuario.imagem_usuario = req.files[0].location;
            usuario.save();

            res.send({ status: true, id: req.files[0].location });
        } catch (dbError) {
            console.error("Erro ao salvar no banco:", dbError);
            res.send({ error: "Erro ao salvar no banco de dados" });
        }
    })
}

async function uploadIMGAluno(req, res) {
    const cod_aluno = req.headers['cod_aluno'];
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });

    if (aluno?.imagem_aluno) {
        if (aluno?.imagem_aluno?.includes('amazonaws.com')) {
            const id = aluno.imagem_aluno.split('/')[aluno.imagem_aluno.split('/').length - 1];
            const removida = await deleteIMG(id);
        }
    }

    const upload = uploadDinamico('aluno/perfil').array('image', 15);

    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });

        try {
            aluno.imagem_aluno = req.files[0].location;
            aluno.save();

            res.send({ status: true, id: req.files[0].location });
        } catch (dbError) {
            console.error("Erro ao salvar no banco:", dbError);
            res.send({ error: "Erro ao salvar no banco de dados" });
        }
    })
}

async function uploadIMGAlimento(req, res) {
    const cod_alimento = req.headers['cod_alimento'];
    const alimento = await tab_alimento.findOne({ where: { cod_alimento } });

    if (alimento?.imagem_alimento) {
        if (alimento?.imagem_alimento?.includes('amazonaws.com')) {
            const id = alimento.imagem_alimento.split('/')[alimento.imagem_alimento.split('/').length - 1];
            const removida = await deleteIMG(id);
        }
    }

    const upload = uploadDinamico('alimento').array('image', 15);

    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });

        try {
            alimento.imagem_alimento = req.files[0].location;
            alimento.save();

            res.send({ status: true, id: req.files[0].location });
        } catch (dbError) {
            console.error("Erro ao salvar no banco:", dbError);
            res.send({ error: "Erro ao salvar no banco de dados" });
        }
    })
}

async function uploadIMGEmpresa(req, res) {
    const cod_empresa = req.headers['cod_empresa'];
    const empresa = await tab_empresa.findOne({ where: { cod_empresa } });

    if (empresa?.imagem_empresa) {
        if (empresa?.imagem_empresa?.includes('amazonaws.com')) {
            const id = empresa.imagem_empresa.split('/')[empresa.imagem_empresa.split('/').length - 1];
            const removida = await deleteIMG(id);
        }
    }

    const upload = uploadDinamico('empresa').array('image', 15);

    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });

        try {
            empresa.imagem_empresa = req.files[0].location;
            empresa.save();

            res.send({ status: true, id: req.files[0].location });
        } catch (dbError) {
            console.error("Erro ao salvar no banco:", dbError);
            res.send({ error: "Erro ao salvar no banco de dados" });
        }
    })
}

async function deleteIMG(folder, id) {
    try {
        const params = {
            Bucket: 'apppersonalfit',
            Key: `${folder}/${id}`
        };

        const s3Client = getS3Client();
    
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
    
        console.log(`Imagem com ID ${id} excluída com sucesso.`);

        return true;
    } catch (error) {
        console.error(`Erro ao excluir a imagem com ID ${id}:`, error);
        return false;
    }
}

module.exports = {
    uploadIMGAvaliacao,
    uploadIMGUsuario,
    uploadIMGAluno,
    uploadIMGAlimento,
    uploadIMGEmpresa,
};