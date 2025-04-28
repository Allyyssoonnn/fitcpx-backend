const urlBase = 'https://api.autentique.com.br/v2/graphql';
const token = process.env.AUTENTIQUE_KEY;
const multer = require('multer');
const env = process.env.NODE_ENV || 'development';
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');
const fs = require('fs');

async function sendDocument(contratoPdfObject, emailAluno, nomeDocumento = 'Contrato') {
    try {
        let data = new FormData();
        data.append('operations',
            `{"query":"mutation CreateDocumentMutation($document: DocumentInput!,$signers: [SignerInput!]!,$file: Upload!) {createDocument(sandbox: ${env === 'development' ? 'true' : 'false'},document: $document,signers: $signers,file: $file) {id name refusable sortable created_at signatures { public_id name email created_at action { name } link { short_link } user { id name email }}}}","variables":{"document": {"name": "${nomeDocumento}"},"signers": [{"email": "${emailAluno}","action": "SIGN"}],"file":null}}`
        );
        data.append('map', '{"file": ["variables.file"]}');
        data.append('file', contratoPdfObject.buffer, {
            filename: `${nomeDocumento}.pdf`,
            contentType: 'application/pdf',
        });
        // data.append('file', fs.createReadStream(path.join(__dirname, './Contrato Social LAB COMPLEX DEV LTDA.pdf')));

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: urlBase,
            headers: { 'Authorization': `Bearer ${token}`, ...data.getHeaders() },
            data : data
        };
          
        const resp = await axios.request(config)

        if (resp) {
            console.log(JSON.stringify(resp.data));
            return resp.data.data.createDocument.id;
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteDocument(id) {
    let data = JSON.stringify({
        "query": `mutation { deleteDocument(id: "${id}") }`,
        "variables": {}
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: urlBase,
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });
}

async function downloadContract(documentId, signed) {
    try {
        let data = JSON.stringify({
            "query": `query { document(id: "${documentId}") { id name refusable sortable created_at files { original signed } signatures { public_id name email created_at action { name } link { short_link } user { id name email } email_events { sent opened delivered refused reason } viewed { ...event } signed { ...event } rejected { ...event } } } } fragment event on Event { ip port reason created_at geolocation { country countryISO state stateISO city zipcode latitude longitude } }`,
            "variables": {}
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.autentique.com.br/v2/graphql',
            headers: { 
              'Authorization': 'Bearer [REDACTED_CREDENTIAL]', 
              'Content-Type': 'application/json'
            },
            data : data
        };

        const resp = await axios.request(config);

        const document = resp?.data?.data?.document;
        if (document?.files?.signed && signed) {
            return document?.files?.signed;
        } else if (document?.files?.original) {
            return document?.files?.original;
        } else {
            return null;
        }        
    } catch (error) {
        console.error(error);
        return null;
    }
}

function multerAutentique() {
    const upload = multer();
    return upload.single('contratoPDF');
}

module.exports = {
    sendDocument,
    deleteDocument,
    downloadContract,
    multerAutentique,
};