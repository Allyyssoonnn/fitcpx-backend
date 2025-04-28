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
          
        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            return response.data.data.createDocument.id;
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
}

async function deleteDocument(id) {
    let data = JSON.stringify({
        "query": `mutation { deleteDocument(id: ${id}) }`,
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

function multerAutentique() {
    const upload = multer();
    return upload.single('contratoPDF');
}

module.exports = {
    sendDocument,
    deleteDocument,
    multerAutentique,
};