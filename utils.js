const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require("@aws-sdk/lib-storage");

function removeStringVazia(data) {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
    );
}

const region = 'us-east-2';

function getS3Client() {
    // Configuração do cliente S3
    const s3Client = new S3Client({
        region: region, // Substitua pela região do seu bucket, como 'us-east-1'
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

module.exports = {
    removeStringVazia,
    getS3Client,
}