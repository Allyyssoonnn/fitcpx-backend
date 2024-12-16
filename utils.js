const { google } = require('googleapis');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const fs = require('fs');

function removeStringVazia(data) {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
    );
}

const region = 'us-east-2';

// Configuração do cliente S3
const s3Client = new S3Client({
    region: region, // Substitua pela região do seu bucket, como 'us-east-1'
    credentials: {
        accessKeyId: '[REDACTED_CREDENTIAL]', // Substitua pela sua Access Key
        secretAccessKey: '[REDACTED_CREDENTIAL]', // Substitua pela sua Secret Key
    },
});

const auth = new google.auth.GoogleAuth({
    keyFile: path.join('./utils/aplicativo-444120-7fbf0ebd9269.json'),
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });

async function uploadAlunoIMG(filePath, mimeType) {
    const fileMetadata = {
        name: path.basename(filePath),
        // parents: ['18T4-bcQh4XXY0-eq89cdWfVErMXcGaIq'],
    };
      
    const media = {
        mimeType,
        body: fs.createReadStream(filePath),
    };
  
    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });

    await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
    });
    
    return response.data.id;
}

async function uploadAlunoIMGAWS(filePath, mimeType) {
    const fileName = path.basename(filePath);

    // Leia o arquivo do disco
    const fileStream = fs.createReadStream(filePath);

    // Configuração dos parâmetros de upload
    const params = {
        Bucket: 'apppersonalfit', // Substitua pelo nome do seu bucket
        Key: `aluno/perfil/${fileName}`, // O nome do arquivo no bucket
        Body: fileStream,
        ContentType: mimeType, // MimeType do arquivo
        ACL: 'public-read', // Define permissões de leitura pública
    };

    try {
        // Envia o arquivo para o S3
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Construir a URL pública do arquivo
        const publicUrl = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
        console.log('Arquivo enviado com sucesso:', publicUrl);

        return publicUrl;
    } catch (error) {
        console.error('Erro ao enviar arquivo para o S3:', error);
        throw error;
    }
}

async function uploadUsuarioIMGAWS(filePath, mimeType) {
    const fileName = path.basename(filePath);

    // Leia o arquivo do disco
    const fileStream = fs.createReadStream(filePath);

    // Configuração dos parâmetros de upload
    const params = {
        Bucket: 'apppersonalfit', // Substitua pelo nome do seu bucket
        Key: `usuario/perfil/${fileName}`, // O nome do arquivo no bucket
        Body: fileStream,
        ContentType: mimeType, // MimeType do arquivo
        ACL: 'public-read', // Define permissões de leitura pública
    };

    try {
        // Envia o arquivo para o S3
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Construir a URL pública do arquivo
        const publicUrl = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
        console.log('Arquivo enviado com sucesso:', publicUrl);

        return publicUrl;
    } catch (error) {
        console.error('Erro ao enviar arquivo para o S3:', error);
        throw error;
    }
}

async function deleteIMGAWS(id) {
    try {
        const params = {
            Bucket: 'apppersonalfit',
            Key: `aluno/perfil/${id}`
        };
    
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
    removeStringVazia,
    uploadAlunoIMG,
    uploadAlunoIMGAWS,
    deleteIMGAWS,
    uploadUsuarioIMGAWS,
}