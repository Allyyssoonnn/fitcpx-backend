const { Op } = require("sequelize");
const { tab_agenda, tab_google_token, tab_modalidade, tab_usuario } = require("../../database/models");
const { removeStringVazia } = require("../../utils");

async function getAgenda(req, res) {
   const { cod_empresa, cod_aluno } = req.body;
   var where = {};

   const startDate = new Date();
   startDate.setHours(0, 0, 0, 0); // Hoje às 00:00:00
   const endDate = new Date();
   endDate.setDate(startDate.getDate() + 30);
   endDate.setHours(23, 59, 59, 999); // Daqui 30 dias às 23:59:59

   if (cod_empresa) where = { cod_empresa };
   if (cod_aluno) where = { cod_aluno, data_inicio: { [Op.between]: [startDate, endDate] } };
   const agenda = await tab_agenda.findAll({
      include: [
         { model: tab_modalidade, as: "modalidade" },
         { model: tab_usuario, as: "usuario" },
      ],
      where,
   });
   res.send({ status: true, agenda });
}

async function setAgenda(req, res) {
   const { evento } = req.body;
   var agendaAtt;

   if (evento.cod_agenda) agendaAtt = await tab_agenda.findOne({ where: { cod_agenda: evento.cod_agenda } });

   if (agendaAtt) {
      await tab_agenda.update(removeStringVazia(evento), { where: { cod_agenda: evento.cod_agenda } });
   } else {
      const novaAgenda = await tab_agenda.create(removeStringVazia(evento));
      agendaAtt = novaAgenda;
   }

   const agenda = await tab_agenda.findAll({ where: { cod_usuario: evento.cod_usuario } });
   res.send({ status: true, agenda });
}

module.exports = {
   getAgenda,
   setAgenda,
};
