const { tab_email_envio } = require('../database/models');
var postmark = require("postmark");

var serverToken = "[REDACTED_CREDENTIAL]";
var client = new postmark.ServerClient(serverToken);

async function sendEmail(email, msg, header) {  
    try {
        client.sendEmail({
            "From": "noreply@fitcpx.com",
            // "To": email,
            "To": "alyson.personalstudio@gmail.com",
            "Subject": header,
            "TextBody": msg
        });

        tab_email_envio.create({
            email_header: header,
            email_body: msg,
            email_destino: email,
        });
        // console.log("E-mail enviado!", response);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
}

module.exports = {
    sendEmail
}