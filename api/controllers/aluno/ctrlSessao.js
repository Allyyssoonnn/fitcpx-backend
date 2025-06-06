const { Sequelize } = require('sequelize');
const { tab_modalidade, tab_aluno, tab_empresa, tab_aluno_sessao_pacote, tab_aluno_sessao_modalidade } = require('../../../database/models');
const env = process.env.NODE_ENV || 'development';
const moment = require("moment-timezone");

async function setAlunoSessaoPacote(req, res) {
    const { pacote } = req.body;

    const { modalidades, valor_plano, duracao_sessao, cod_aluno, cod_usuario, cod_empresa } = pacote;

    const alunoSessao = await tab_aluno_sessao_pacote.create({
        cod_aluno: cod_aluno,
        cod_usuario: cod_usuario,
        cod_empresa: cod_empresa,
        nome_aluno_sessao_pacote: `Sessões ${moment().format('DD/MM/YYYY')}`,
        expiracao_aluno_sessao_pacote: duracao_sessao ? moment().tz('America/Sao_Paulo').add(duracao_sessao, 'months').format('YYYY-MM-DD') : null,
        expiracao_aluno_sessao_pacote: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
        valor_aluno_sessao_pacote: valor_plano,
        ambiente_aluno_sessao_pacote: env,
    });

    for (const modalidade of modalidades) {
        for (let i = 0; i < (modalidade?.quantidade_modalidade ?? 1); i++) {
            await tab_aluno_sessao_modalidade.create({
                cod_aluno_sessao_pacote: alunoSessao.cod_aluno_sessao_pacote,
                status_aluno_sessao_modalidade: 'Pending',
                ...modalidade
            });
        }
    }

    res.send({ status: true, alunoSessao });
}

async function createPaySessao(req, res) {
    const { cod_aluno, cod_empresa, cod_usuario, cod_aluno_sessao_pacote, formaPagamento, paymentId } = req.body;
    var accountId;
    var customerId;

    res.send({ status: true });
}

async function getAlunoSessoesPacote(req, res) {
    const { cod_aluno, cod_empresa } = req.body;

    const where = { ambiente_aluno_sessao_pacote: env !== 'production' ? 'development' : 'production' };
    if (cod_aluno) where.cod_aluno = cod_aluno;
    if (cod_empresa) where.cod_empresa = cod_empresa;

    const alunoSessoes = await tab_aluno_sessao_pacote.findAll({
        include: [
            {
                model: tab_aluno,
                as: 'aluno',
            },
            {
                model: tab_aluno_sessao_modalidade,
                as: 'sessoes',
                include: [
                    {
                        model: tab_modalidade,
                        as: 'modalidade',
                    },
                ],
            },
        ],
        where
    });

    res.send({ status: true, alunoSessoes });
}

async function getAlunoSessaoPacote(req, res) {
    const { cod_aluno_sessao_pacote } = req.body;

    const alunoSessaoPacote = await tab_aluno_sessao_pacote.findOne({
        include: [
            {
                model: tab_aluno,
                as: 'aluno',
            },
            {
                model: tab_aluno_sessao_modalidade,
                as: 'sessoes',
                include: [
                    {
                        model: tab_modalidade,
                        as: 'modalidade',
                    },
                ],
            },
        ],
        where: { cod_aluno_sessao_pacote }
    });

    res.send({ status: true, alunoSessaoPacote });
}

module.exports = {
    setAlunoSessaoPacote,
    createPaySessao,
    getAlunoSessoesPacote,
    getAlunoSessaoPacote,
}