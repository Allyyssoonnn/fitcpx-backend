const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

function removeStringVazia(data) {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
    );
}

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

module.exports = {
    removeStringVazia,
    uploadAlunoIMG
}