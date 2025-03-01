const { google } = require("googleapis");
const { tab_google_token } = require('../database/models');

const env = process.env.NODE_ENV || 'development';
const urlCallback = env == 'development' ? 'http://localhost:5173/' : 'https://app.fitcpx.com/';

function createOauthClient(client, rotaCallback) {
    const urlRedirect = `${urlCallback}${rotaCallback}`;
    const oauth2Client = new google.auth.OAuth2(
        '129544337181-7rr6i6ban2p64sjuub2jd6jpcr6cucnt.apps.googleusercontent.com',
        '[REDACTED_CREDENTIAL]',
        urlRedirect,
    )
    oauth2Client.setCredentials({
        access_token: client.google_token,
        refresh_token: client.google_refresh_token,
        expiry_date: client.expiresAt,
    });
        
    return oauth2Client;
}

async function getURL(rotaCallback) {
    const urlRedirect = `${urlCallback}${rotaCallback}`;
    const oauth2Client = new google.auth.OAuth2(
        '129544337181-7rr6i6ban2p64sjuub2jd6jpcr6cucnt.apps.googleusercontent.com',
        '[REDACTED_CREDENTIAL]',
        urlRedirect,
    );

    var scope = [];

    if (rotaCallback == 'agenda') scope = [ ...scope,
        "https://www.googleapis.com/auth/calendar.events" // Permite criar, editar e excluir eventos
    ];
    if (rotaCallback == 'entrar') scope = [ ...scope,
        "https://www.googleapis.com/auth/userinfo.email", // Para acessar o email
        "https://www.googleapis.com/auth/userinfo.profile", // Para acessar o nome e foto do usuário (opcional)
    ];

    const authOptions = {
        access_type: "offline",
        scope: scope,
    };
    
    // Adiciona o prompt apenas se for "agenda"
    if (rotaCallback == "agenda") {
        authOptions.prompt = "consent";
    }

    const url = oauth2Client.generateAuthUrl(authOptions);
    
    return url;
}

async function connected(code, rotaCallback) {
    const urlRedirect = `${urlCallback}${rotaCallback}`;
    const oauth2Client = new google.auth.OAuth2(
        '129544337181-7rr6i6ban2p64sjuub2jd6jpcr6cucnt.apps.googleusercontent.com',
        '[REDACTED_CREDENTIAL]',
        urlRedirect,
    );
    const { tokens } = await oauth2Client.getToken(code);
    const access_token = tokens.access_token;
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });

    const { data } = await oauth2.userinfo.get(); // Obtem o email do usuário

    return { ...data, token: access_token, refresh_token: tokens.refresh_token, expiresAt: tokens.expiry_date };
}

async function refreshAccessToken(refreshToken) {
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        return credentials.access_token;
    } catch (error) {
        console.error("Erro ao renovar o token de acesso:", error);
        throw error;
    }
}

async function syncEvents(client) {
    const oauth2Client = createOauthClient(client?.dataValues, 'agenda');

    function isTokenExpired(expiryDate) {
        const bufferTime = 5 * 60 * 1000; // 5 minutos
        return Date.now() >= (expiryDate - bufferTime);
    }

    // Se o token expirou, renove com o refresh_token
    if (isTokenExpired(client.expiresAt)) {
        accessToken = await refreshAccessToken(client.google_refresh_token);
        await tab_google_token.findOneAndUpdate({ cod_google_token: client.cod_google_token }, { google_token: accessToken });
        oauth2Client.setCredentials({ access_token: accessToken });
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  
    const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: "startTime",
    });

    return response?.data?.items || [];
}

module.exports = {
    getURL,
    connected,
    syncEvents
}