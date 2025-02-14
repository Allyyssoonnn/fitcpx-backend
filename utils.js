const { google } = require('googleapis');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require("@aws-sdk/lib-storage");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const path = require('path');
const fs = require('fs');
const { tab_email_envio } = require('./database/models');

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

function destroyS3Client(s3Client) {
    s3Client.destroy();
}

// Configurar o cliente SES
const sesClient = new SESClient({
    region: "sa-east-1",
    credentials: {
        accessKeyId: '[REDACTED_CREDENTIAL]', // Substitua pela sua Access Key
        secretAccessKey: '[REDACTED_CREDENTIAL]', // Substitua pela sua Secret Key
    },
});

// ================================= E-mail

async function sendEmail(email, msg, header) {
    const params = {
        Source: "noreply@fitcpx.com", // Precisa estar verificado no AWS SES
        Destination: {
            ToAddresses: [email], // Destinatário do e-mail
        },
        Message: {
            Subject: { Data: header },
            Body: {
                Text: { Data: msg },
            },
        },
    };
  
    try {
        const command = new SendEmailCommand(params);
        const response = await sesClient.send(command);
        tab_email_envio.create({
            email_header: header,
            email_body: msg,
            email_destino: email,
        });
        console.log("E-mail enviado!", response);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
}

module.exports = {
    removeStringVazia,
    sendEmail,
    getS3Client,
}