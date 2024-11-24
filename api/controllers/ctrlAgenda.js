const { tab_agenda } = require('../../database/models');

async function getAgenda(req, res) {    
    const { cod_usuario } = req.body;
    const agenda = await tab_agenda.findAll({ where: { cod_usuario: cod_usuario } });
    res.send({ status: true, agenda });
}

async function setAgenda(req, res) {    
    const { evento } = req.body;
    var agendaAtt;

    if (evento.cod_evento) agendaAtt = await tab_agenda.findOne({ where: { cod_evento: evento.cod_evento } });

    if (agendaAtt) {
        await tab_agenda.update(evento, { where: { cod_evento: aluno.cod_evento } });
    } else {
        const novaAgenda = await tab_agenda.create(evento);
        agendaAtt = novaAgenda;
    }

    const agenda = await tab_agenda.findAll({ where: { cod_usuario: evento.cod_usuario } });    
    res.send({ status: true, agenda });
}

module.exports = {
    getAgenda,
    setAgenda,
}