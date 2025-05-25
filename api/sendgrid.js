const { tab_email_envio } = require('../database/models');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('[REDACTED_CREDENTIAL]');
const env = process.env.NODE_ENV || 'development';
const dev = env === 'development';

async function sendEmail(email, msgHtml, header) {  
    try {
        if (dev) return;
        sgMail
        .send({
            to: email,
            from: 'noreply@fitcpx.com',
            subject: header,
            // text: msg,
            html: msgHtml,
            headers: { "X-SMTPAPI": '{"category": ["transactional"]}' },
        })
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })

        tab_email_envio.create({
            email_header: header,
            email_body: msgHtml,
            email_destino: email,
        });
        // console.log("E-mail enviado!", response);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
}

async function getMsgEmailConfirmation(empresa) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Confirmação de E-mail</title>
        <style>
            body, table, td {
                font-family: Arial, sans-serif;
            }
            .container {
                max-width: 500px;
                width: 100%;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .code {
                font-size: 24px;
                font-weight: bold;
                color: #007BFF;
                background: #f0f0f0;
                padding: 10px;
                border-radius: 5px;
                display: inline-block;
                margin: 10px 0;
            }
            .footer {
                font-size: 12px;
                color: #888;
                margin-top: 20px;
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
                <td align="center" style="padding: 20px;">
                    <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td align="center">
                                <h2 style="color: #333;">Confirmação de E-mail</h2>
                                <p>Olá, <strong>${empresa.nome_empresa}</strong></p>
                                <p>Seu código de verificação é:</p>
                                <p class="code">${empresa.email_codigo}</p>
                                <p>Digite este código no aplicativo para continuar.</p>
                                <p style="font-size: 14px;">Se você não solicitou este código, ignore este e-mail.</p>
                                <p class="footer">Atenciosamente,<br><strong>Fit Complex</strong></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

async function getMsgEmailRecovery(usuario, token) {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Recuperação de Senha</title>
            <style>
                body, table, td {
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 500px;
                    width: 100%;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .logo {
                    width: 150px;
                    margin-bottom: 20px;
                }
                .code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007BFF;
                    background: #f0f0f0;
                    padding: 10px;
                    border-radius: 5px;
                    display: inline-block;
                    margin: 10px 0;
                }
                .footer {
                    font-size: 12px;
                    color: #888;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                    <td align="center" style="padding: 20px;">
                        <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td align="center">
                                    <img src="https://fitcpx.com/assets/imagens/logo/logo.png" alt="Fit Complex" class="logo">
                                    <h2 style="color: #333;">Recuperação de Senha</h2>
                                    <p>Olá, <strong style="font-weight: bold;">${usuario.nome_usuario}</strong></p>
                                    <p>Link de recuperação:</p>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                        <tr>
                                            <td style="border-radius: 5px;" bgcolor="#007BFF">
                                                <a href="https://app.fitcpx.com/recoveryPassword?token=${token}" 
                                                style="display: inline-block; font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; background-color: #007BFF; font-weight: bold;">
                                                    Redefinir Senha
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    <p>Clique para redefinir sua senha.</p>
                                    <p style="font-size: 14px;">Link com validade de 1 hora.</p>
                                    <p style="font-size: 14px;">Se você não solicitou, ignore este e-mail.</p>
                                    <p class="footer">Atenciosamente,<br><strong style="font-weight: bold;">Fit Complex</strong></p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

module.exports = {
    sendEmail,
    getMsgEmailConfirmation,
    getMsgEmailRecovery
}