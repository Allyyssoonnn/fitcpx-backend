const { Sequelize } = require('sequelize');
const { tab_alimento, tab_grupo_alimento, tab_cardapio, tab_refeicao, tab_refeicao_alimento, tab_usuario } = require('../../database/models');

async function getCardapios(req, res) {
    const { cod_empresa, cod_aluno, deleted, findAll } = req.body;
    var where;
    if (cod_empresa && !findAll) where = { [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ], cod_aluno: null };
    if (cod_empresa && findAll) where = { [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ] };
    if (cod_aluno) where = { cod_aluno: cod_aluno };
    if (deleted) where = { ...where, deletedAt: { [Sequelize.Op.ne]: null } };
    const cardapios = await tab_cardapio.findAll({
        where: where,
        include: [
            {
                model: tab_usuario,
                as: 'usuario',
            },
            {
                model: tab_refeicao,
                as: 'refeicoes',
                include: [
                    {
                        model: tab_refeicao_alimento,
                        as: 'alimentos',
                        include: [
                            {
                                model: tab_alimento,
                                as: 'alimento',
                            }
                        ],
                        order: [['sequencia_refeicao_alimento', 'ASC']]
                    }
                ],
                order: [['sequencia_refeicao', 'ASC']]
            },
        ],
        paranoid: !deleted
    });
    //Junta a informação dos exercicios junto ao objeto exercicio para que não exista um objeto exercicio dentro de outro
    const cardapiosReorganizados = cardapios.map((cardapio) => {
        const cardapioLimpo = cardapio.toJSON();

        const refeicoesOrdenadas = [...cardapioLimpo.refeicoes].sort(
            (a, b) => a.sequencia_refeicao - b.sequencia_refeicao
        );

        return ({
            ...cardapioLimpo,
            refeicoes: refeicoesOrdenadas.map((refeicao) => {
                // Ordena os exercícios por `sequencia_sessao_exercicios`
                const alimentosOrdenados = [...refeicao.alimentos].sort(
                    (a, b) => a.sequencia_sessao_exercicios - b.sequencia_sessao_exercicios
                );

                const agrupados = {};

                // Agrupa os exercícios por `sequencia_sessao_exercicios`
                alimentosOrdenados.forEach((alimento) => {
                    const sequencia = alimento.sequencia_refeicao_alimento;
                    
                    if (!agrupados[sequencia]) {
                        agrupados[sequencia] = {
                            //Sequencia importante para preservar as informações do createdAt, deletedAt, updatedAt
                            ...alimento.alimento,
                            ...alimento,
                        };
                    } else {
                        agrupados[sequencia].sets.push({
                            //Sequencia importante para preservar as informações do createdAt, deletedAt, updatedAt
                            ...alimento.alimento,
                            ...alimento,
                        });
                    }
                });

                return ({
                    ...refeicao,
                    alimentos: Object.values(agrupados).map((alimento) => ({
                        //Sequencia importante para preservar as informações do createdAt, deletedAt, updatedAt
                        ...alimento.alimento,
                        ...alimento,
                    })),
                })
            })
        })
    })
    res.send({ status: true, cardapios: cardapiosReorganizados });
}

async function setCardapio(req, res) {
    const { cardapio } = req.body;
    var cardapioAtt;

    if (cardapio.cod_cardapio) cardapioAtt = await tab_cardapio.findOne({ where: { cod_cardapio: cardapio.cod_cardapio } });

    if (cardapioAtt) {
        await tab_cardapio.update(cardapio, { where: { cod_cardapio: cardapio.cod_cardapio } });
    } else {
        const novoCardapio = await tab_cardapio.create(cardapio);
        cardapioAtt = novoCardapio;
    }

    res.send({ status: true, cardapio: cardapioAtt });
}

async function deleteCardapio(req, res) {
    const { cod_cardapio } = req.body;
    await tab_cardapio.update({ deletedAt: new Date() }, { where: { cod_cardapio: cod_cardapio } });
    res.send({ status: true });
}

async function recoveryCardapio(req, res) {
    const { cod_cardapio } = req.body;
    await tab_cardapio.update({ deletedAt: null }, { where: { cod_cardapio: cod_cardapio }, paranoid: false });
    res.send({ status: true });
}

async function setRefeicao(req, res) {
    const { refeicoes, cod_cardapio, cod_empresa, cod_usuario, removidos } = req.body;
    var refeicoesAtt = [];

    async function setRefeicaoAlimentos(refeicao, alimentos) {
        for (const alimento of alimentos) {
            if (alimento.cod_refeicao_alimento) {
                await tab_refeicao_alimento.update({ ...alimento, cod_refeicao: refeicao.cod_refeicao }, { where: { cod_refeicao_alimento: alimento.cod_refeicao_alimento } });
            } else {
                await tab_refeicao_alimento.create({ ...alimento, cod_refeicao: refeicao.cod_refeicao });
            }
        }
    }

    for (const refeicao of refeicoes) {
        if (refeicao.cod_refeicao) {
            await tab_refeicao.update(refeicao, { where: { cod_refeicao: refeicao.cod_refeicao } });
            await setRefeicaoAlimentos(refeicao, refeicao.alimentos);
            refeicoesAtt.push(refeicao);
        } else {
            const resp = await tab_refeicao.create({ ...refeicao, cod_cardapio, cod_empresa, cod_usuario });
            await setRefeicaoAlimentos(resp, refeicao.alimentos);
            refeicoesAtt.push(resp);
        }
    }

    for (const removido of removidos) {
        tab_refeicao.update({ deletedAt: new Date() }, { where: { cod_refeicao: removido.cod_refeicao } });
    }

    res.send({ status: true, refeicoes: refeicoesAtt });
}

async function getAlimentos(req, res) {
    const { cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    const alimentos = await tab_alimento.findAll({
        where: {
            [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ],
            ...where
        },
        paranoid: !deleted,
        include: [
            {
                model: tab_grupo_alimento,
                as: 'grupo_alimento',
            }
        ],
        order: [['nome_alimento', 'ASC']]
    });
    res.send({ status: true, alimentos });
}

async function setAlimento(req, res) {
    const { alimento } = req.body;
    var alimentoAtt;

    if (alimento.cod_alimento) alimentoAtt = await tab_alimento.findOne({ where: { cod_alimento: alimento.cod_alimento } });

    if (alimentoAtt) {
        await tab_alimento.update(alimento, { where: { cod_alimento: alimento.cod_alimento } });
    } else {
        const novoGrupo = await tab_alimento.create(alimento);
        alimentoAtt = novoGrupo;
    }

    res.send({ status: true, alimento: alimentoAtt });
}

async function deleteAlimento(req, res) {
    const { cod_alimento } = req.body;
    await tab_grupo_alimento.update({ deletedAt: new Date() }, { where: { cod_alimento: cod_alimento } });
    res.send({ status: true });
}

async function recoveryAlimento(req, res) {
    const { cod_alimento } = req.body;
    await tab_grupo_alimento.update({ deletedAt: null }, { where: { cod_alimento: cod_alimento }, paranoid: false });
    res.send({ status: true });
}

async function getGrupoAlimentos(req, res) {
    const { cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    const grupos = await tab_grupo_alimento.findAll({ where: {
        [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ],
        ...where
    }, paranoid: !deleted });
    res.send({ status: true, grupos });
}

async function setGrupoAlimento(req, res) {
    const { grupo } = req.body;
    var grupoAtt;

    if (grupo.cod_grupo_alimento) grupoAtt = await tab_grupo_alimento.findOne({ where: { cod_grupo_alimento: grupo.cod_grupo_alimento } });

    if (grupoAtt) {
        await tab_grupo_alimento.update(grupo, { where: { cod_grupo_alimento: grupo.cod_grupo_alimento } });
    } else {
        const novoGrupo = await tab_grupo_alimento.create(grupo);
        grupoAtt = novoGrupo;
    }

    res.send({ status: true });
}

async function deleteGrupoAlimento(req, res) {
    const { cod_grupo_alimento } = req.body;
    await tab_grupo_alimento.update({ deletedAt: new Date() }, { where: { cod_grupo_alimento: cod_grupo_alimento } });
    res.send({ status: true });
}

async function recoveryGrupoAlimento(req, res) {
    const { cod_grupo_alimento } = req.body;
    await tab_grupo_alimento.update({ deletedAt: null }, { where: { cod_grupo_alimento: cod_grupo_alimento }, paranoid: false });
    res.send({ status: true });
}

module.exports = {
    getCardapios,
    setCardapio,
    deleteCardapio,
    recoveryCardapio,
    setRefeicao,
    getAlimentos,
    setAlimento,
    deleteAlimento,
    recoveryAlimento,
    getGrupoAlimentos,
    setGrupoAlimento,
    deleteGrupoAlimento,
    recoveryGrupoAlimento,
}