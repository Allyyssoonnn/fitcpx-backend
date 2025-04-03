const axios = require("axios");

const urlBase = env === 'development'
    ? 'https://sandbox.api.autentique.com.br/v2/graphql'
    : 'https://api.autentique.com.br/v2/graphql-block'
;

const token = process.env.AUTENTIQUE_KEY;

async function sendDocument(contratoHtml) {
    const AUTENTIQUE_API_URL = urlBase;
    const AUTENTIQUE_TOKEN = token; // Substitua pelo seu token de API

    const query = `
        mutation {
            createDocument(
                input: {
                    name: "Contrato de Prestação de Serviços",
                    signers: [
                        { email: "cliente@email.com", action: "SIGN" }
                    ],
                    file: {
                        content: "${Buffer.from(contratoHtml).toString("base64")}",
                        filename: "contrato.html"
                    }
                }
            ) {
                document {
                    id
                    name
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            AUTENTIQUE_API_URL,
            { query },
            { headers: { Authorization: `Bearer ${AUTENTIQUE_TOKEN}` } }
        );

        console.log("Documento enviado com sucesso:", response.data);
    } catch (error) {
        console.error("Erro ao enviar documento:", error.response?.data || error.message);
    }
}

module.exports = {
    sendDocument
};