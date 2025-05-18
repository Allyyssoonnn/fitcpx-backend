const { tab_agenda, tab_google_token } = require('../../database/models');
const { removeStringVazia } = require('../../utils');
const { getURL, connected, syncEvents } = require('../google');

async function getAgenda(req, res) {    
    const { cod_empresa } = req.body;
    const agenda = await tab_agenda.findAll({ where: { cod_empresa: cod_empresa } });
    res.send({ status: true, agenda });
}

async function setAgenda(req, res) {    
    const { evento } = req.body;
    var agendaAtt;

    if (evento.cod_evento) agendaAtt = await tab_agenda.findOne({ where: { cod_evento: evento.cod_evento } });

    if (agendaAtt) {
        await tab_agenda.update(removeStringVazia(evento), { where: { cod_evento: aluno.cod_evento } });
    } else {
        const novaAgenda = await tab_agenda.create(removeStringVazia(evento));
        agendaAtt = novaAgenda;
    }

    const agenda = await tab_agenda.findAll({ where: { cod_usuario: evento.cod_usuario } });    
    res.send({ status: true, agenda });
}

async function conectGoogle(req, res) {
    const url = await getURL('agenda');
    res.send({ status: true, url });
    // res.redirect(url);
}

async function conectedGoogle(req, res) {
    const { code, scope, cod_empresa } = req.body;
    const data = await connected(code, 'agenda');

    tab_google_token.create({
        email_google: data.email,
        google_token: data.token,
        google_refresh_token: data.refresh_token,
        cod_empresa: cod_empresa,
        expiresAt: data.expiresAt,
    });

    res.send({ status: true, msg: 'Google Agenda conectada com sucesso!' });
}

async function getGoogleConnect(req, res) {
    const { cod_empresa } = req.body;

    const google = await tab_google_token.findOne({ cod_empresa: cod_empresa });

    const resp = google?.cod_google_token ? { email_google: google?.email_google } : null;
    res.send({ status: true, google: resp });
}

async function syncGoogleEvents(req, res) {
    const { cod_empresa } = req.body;

    const google = await tab_google_token.findOne({ cod_empresa: cod_empresa });

    const eventos = await syncEvents(google);

    if (eventos && eventos.length) {
        for (const evento of eventos) {
            const agendaData = {
                eventId: evento.id, // ID único do evento
                summary: evento.summary, // Título do evento
                startTime: evento.start.dateTime || evento.start.date, // Horário de início
                endTime: evento.end.dateTime || evento.end.date, // Horário de fim
                location: evento.location || null, // Local (se houver)
                description: evento.description || null, // Descrição (se houver)
                created: evento.created, // Data de criação
                updated: evento.updated, // Data de atualização
            };            

            if (await tab_agenda.findOne({ where: { google_id: evento.id } })) {
                //Atualiza
            } else {
                //Cria
                await tab_agenda.create({
                    google_id: evento.id,
                    cod_empresa: cod_empresa,
                    nome_evento: evento.summary,
                    desricao_evento: evento.description || null,
                    localizacao_evento: evento.location || null,
                    data_inicio: evento.start.dateTime || evento.start.date,
                    data_fim: evento.end.dateTime || evento.end.date,
                    createdAt: evento.created,
                    updatedAt: evento.updated,
                });
            }
        }
    }

    res.send({ status: true });
}

module.exports = {
    getAgenda,
    setAgenda,
    conectGoogle,
    conectedGoogle,
    getGoogleConnect,
    syncGoogleEvents,
}