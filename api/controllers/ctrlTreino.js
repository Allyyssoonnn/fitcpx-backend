const { Sequelize, Op } = require('sequelize');
const { tab_treino, tab_grupo_exercicio, tab_exercicio, tab_usuario, tab_sessao, tab_equipamento, tab_articulacao, tab_tipo_exercicio, tab_exercicio_resistencia, tab_indicacao, tab_padrao_movimento, tab_sessao_exercicio } = require('../../database/models');

async function getTreinos(req, res) {
    const { cod_empresa, cod_aluno, deleted, findAll } = req.body;
    var where;
    if (cod_empresa && !findAll) where = { [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ], cod_aluno: null };
    if (cod_empresa && findAll) where = { [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ] };
    if (cod_aluno) where = { cod_aluno: cod_aluno };
    if (deleted) where = { ...where, deletedAt: { [Sequelize.Op.ne]: null } };
    const treinos = await tab_treino.findAll({
        where: where,
        include: [
            {
                model: tab_usuario,
                as: 'usuario',
            },
            {
                model: tab_sessao,
                as: 'sessoes',
                include: [
                    {
                        model: tab_sessao_exercicio,
                        as: 'exercicios',
                        include: [
                            {
                                model: tab_exercicio,
                                as: 'exercicio',
                                include: [
                                    {
                                        model: tab_grupo_exercicio,
                                        as: 'grupo_exercicio_1',
                                    }
                                ]
                            },
                        ],
                        order: [['sequencia_sessao_exercicio', 'ASC']]
                    }
                ],
                order: [['sequencia_sessao', 'ASC']]
            },
        ],
        paranoid: !deleted
    });
    //Junta a informação dos exercicios junto ao objeto exercicio para que não exista um objeto exercicio dentro de outro
    const treinosReorganizados = treinos.map((treino) => {
        const treinoLimpo = treino.toJSON();

        const sessoesOrdenadas = [...treinoLimpo.sessoes].sort(
            (a, b) => a.sequencia_sessao - b.sequencia_sessao
        );

        return ({
            ...treinoLimpo,
            sessoes: sessoesOrdenadas.map((sessao) => {
                // Ordena os exercícios por `sequencia_sessao_exercicios`
                const exerciciosOrdenados = [...sessao.exercicios].sort(
                    (a, b) => a.sequencia_sessao_exercicios - b.sequencia_sessao_exercicios
                );

                const agrupados = {};

                // Agrupa os exercícios por `sequencia_sessao_exercicios`
                exerciciosOrdenados.forEach((exercicio) => {
                    const sequencia = exercicio.sequencia_sessao_exercicio;
                    
                    if (!agrupados[sequencia]) {
                        agrupados[sequencia] = {
                            //Sequencia importante para preservar as informações do createdAt, deletedAt, updatedAt
                            ...exercicio.exercicio,
                            ...exercicio,
                            sets: [], // Inicializa o array `sets`
                        };
                    } else {
                        agrupados[sequencia].sets.push({
                            //Sequencia importante para preservar as informações do createdAt, deletedAt, updatedAt
                            ...exercicio.exercicio,
                            ...exercicio,
                        });
                    }
                });

                return ({
                    ...sessao,
                    exercicios: Object.values(agrupados).map((exercicio) => ({
                        //Sequencia importante para preservar as informações do createdAt, deletedAt, updatedAt
                        ...exercicio.exercicio,
                        ...exercicio,
                        sets: exercicio.sets || [], // Garante que o campo exista
                    })),
                })
            })
        })
    })
    res.send({ status: true, treinos: treinosReorganizados });
}

async function getTreino(req, res) {
    const { cod_treino, deleted } = req.body;
    var where;
    if (cod_treino) where = { cod_treino: cod_treino };
    where = { ...where, deletedAt: { [Sequelize.Op.ne]: null } };
    const treino = await tab_treino.findOne({
        where: where,
        include: [
            {
                model: tab_usuario,
                as: 'usuario',
            },
            {
                model: tab_sessao,
                as: 'sessoes',
                include: [
                    {
                        model: tab_sessao_exercicio,
                        as: 'exercicios',
                        include: [
                            {
                                model: tab_exercicio,
                                as: 'exercicio',
                                include: [
                                    {
                                        model: tab_grupo_exercicio,
                                        as: 'grupo_exercicio_1',
                                    }
                                ]
                            },
                        ],
                        order: [['sequencia_sessao_exercicio', 'ASC']]
                    }
                ],
                order: [['sequencia_sessao', 'ASC']]
            },
        ],
        paranoid: !deleted
    });
    //Junta a informação dos exercicios junto ao objeto exercicio para que não exista um objeto exercicio dentro de outro
    
    const treinoLimpo = treino.toJSON();

    const sessoesOrdenadas = [...treinoLimpo.sessoes].sort(
        (a, b) => a.sequencia_sessao - b.sequencia_sessao
    );

    const treinoOrganizado = {
        ...treinoLimpo,
        sessoes: sessoesOrdenadas.map((sessao) => {
            // Ordena os exercícios por `sequencia_sessao_exercicios`
            const exerciciosOrdenados = [...sessao.exercicios].sort(
                (a, b) => a.sequencia_sessao_exercicios - b.sequencia_sessao_exercicios
            );

            const agrupados = {};

            // Agrupa os exercícios por `sequencia_sessao_exercicios`
            exerciciosOrdenados.forEach((exercicio) => {
                const sequencia = exercicio.sequencia_sessao_exercicio;
                
                if (!agrupados[sequencia]) {
                    agrupados[sequencia] = {
                        //Sequencia importante para preservar as informações do createdAt, deletedAt, updatedAt
                        ...exercicio.exercicio,
                        ...exercicio,
                        sets: [], // Inicializa o array `sets`
                    };
                } else {
                    agrupados[sequencia].sets.push({
                        //Sequencia importante para preservar as informações do createdAt, deletedAt, updatedAt
                        ...exercicio.exercicio,
                        ...exercicio,
                    });
                }
            });

            return ({
                ...sessao,
                exercicios: Object.values(agrupados).map((exercicio) => ({
                    //Sequencia importante para preservar as informações do createdAt, deletedAt, updatedAt
                    ...exercicio.exercicio,
                    ...exercicio,
                    sets: exercicio.sets || [], // Garante que o campo exista
                })),
            })
        })
    }

    res.send({ status: true, treino: treinoOrganizado });
}

async function setTreino(req, res) {
    const { treino } = req.body;
    var treinoAtt;

    if (treino.cod_treino) treinoAtt = await tab_treino.findOne({ where: { cod_treino: treino.cod_treino } });

    if (treinoAtt) {
        await tab_treino.update(treino, { where: { cod_treino: treino.cod_treino } });
    } else {
        const novoTreino = await tab_treino.create(treino);
        treinoAtt = novoTreino;
    }

    res.send({ status: true, treino: treinoAtt });
}

async function deleteTreino(req, res) {
    const { cod_treino } = req.body;
    await tab_treino.update({ deletedAt: new Date() }, { where: { cod_treino: cod_treino } });
    res.send({ status: true });
}

async function getGrupoExercicios(req, res) {
    const { cod_empresa, deleted } = req.body;
    var where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    if (cod_empresa) where = { ...where, [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ] };
    const grupos = await tab_grupo_exercicio.findAll({ where: where, paranoid: !deleted });
    res.send({ status: true, grupos });
}

async function setGrupoExercicio(req, res) {
    const { grupo } = req.body;
    var grupoAtt;

    if (grupo.cod_grupo_exercicio) grupoAtt = await tab_grupo_exercicio.findOne({ where: { cod_grupo_exercicio: grupo.cod_grupo_exercicio } });

    if (grupoAtt) {
        await tab_grupo_exercicio.update(grupo, { where: { cod_grupo_exercicio: grupo.cod_grupo_exercicio } });
    } else {
        const novoGrupo = await tab_grupo_exercicio.create(grupo);
        grupoAtt = novoGrupo;
    }

    res.send({ status: true });
}

async function deleteGrupoExercicio(req, res) {
    const { cod_grupo_exercicio } = req.body;
    await tab_grupo_exercicio.update({ deletedAt: new Date() }, { where: { cod_grupo_exercicio: cod_grupo_exercicio } });
    res.send({ status: true });
}

async function recoveryGrupoExercicio(req, res) {
    const { cod_grupo_exercicio } = req.body;
    await tab_grupo_exercicio.update({ deletedAt: null }, { where: { cod_grupo_exercicio: cod_grupo_exercicio }, paranoid: false });
    res.send({ status: true });
}

async function getExercicios(req, res) {
    const { cod_empresa, deleted } = req.body;
    var where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    if (cod_empresa) where = { ...where, [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ] }
    // Se não houver cod_empresa, inclui os exercícios mesmo que tenham deletedAt preenchido
    if (!cod_empresa) where = { ...where, deletedAt: { [Sequelize.Op.or]: [null, { [Sequelize.Op.ne]: null }] } };
    const exercicios = await tab_exercicio.findAll({
        where: where,
        paranoid: cod_empresa ? !deleted : false,
        include: [
            { model: tab_usuario, as: 'usuario', },
            { model: tab_grupo_exercicio, as: 'grupo_exercicio_1', attributes: ['nome_grupo_exercicio'] },
            { model: tab_grupo_exercicio, as: 'grupo_exercicio_2', attributes: ['nome_grupo_exercicio'] },
            { model: tab_grupo_exercicio, as: 'grupo_exercicio_3', attributes: ['nome_grupo_exercicio'] },
            { model: tab_grupo_exercicio, as: 'grupo_exercicio_4', attributes: ['nome_grupo_exercicio'] },
            { model: tab_grupo_exercicio, as: 'grupo_exercicio_5', attributes: ['nome_grupo_exercicio'] },
            { model: tab_grupo_exercicio, as: 'grupo_exercicio_6', attributes: ['nome_grupo_exercicio'] },
            { model: tab_grupo_exercicio, as: 'grupo_exercicio_7', attributes: ['nome_grupo_exercicio'] },
            { model: tab_grupo_exercicio, as: 'grupo_exercicio_8', attributes: ['nome_grupo_exercicio'] },
        ],
        order: [['nome_exercicio', 'ASC']]
    });
    res.send({ status: true, exercicios });
}

async function setExercicio(req, res) {
    const { exercicio } = req.body;
    var exercicioAtt;

    if (exercicio.cod_exercicio) exercicioAtt = await tab_exercicio.findOne({ where: { cod_exercicio: exercicio.cod_exercicio } });

    if (exercicioAtt) {
        await tab_exercicio.update(exercicio, { where: { cod_exercicio: exercicio.cod_exercicio } });
    } else {
        const novoExercicio = await tab_exercicio.create(exercicio);
        exercicioAtt = novoExercicio;
    }

    res.send({ status: true });
}

async function deleteExercicio(req, res) {
    const { cod_exercicio } = req.body;
    await tab_exercicio.update({ deletedAt: new Date() }, { where: { cod_exercicio: cod_exercicio } });
    res.send({ status: true });
}

async function recoveryExercicio(req, res) {
    const { cod_exercicio } = req.body;
    await tab_exercicio.update({ deletedAt: null }, { where: { cod_exercicio: cod_exercicio }, paranoid: false });
    res.send({ status: true });
}

// async function getSessoes(req, res) {
//     const { cod_empresa, deleted } = req.body;
//     const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
//     const sessoes = await tab_sessao.findAll({
//         where: { cod_empresa: cod_empresa, ...where, cod_treino: null },
//         paranoid: !deleted
//     });
//     res.send({ status: true, sessoes });
// }

async function setSessoes(req, res) {
    const { sessoes, cod_treino, cod_empresa, cod_usuario, removidos } = req.body;
    var sessoesAtt = [];

    async function setSessaoExercicios(sessao, exercicios) {
        for (const exercicio of exercicios) {
            if (exercicio.cod_sessao_exercicio) {
                await tab_sessao_exercicio.update({ ...exercicio, cod_sessao: sessao.cod_sessao }, { where: { cod_sessao_exercicio: exercicio.cod_sessao_exercicio } });
            } else {
                await tab_sessao_exercicio.create({ ...exercicio, cod_sessao: sessao.cod_sessao });
            }
            
            for (const set of exercicio?.sets) {
                if (set.cod_sessao_exercicio) {
                    await tab_sessao_exercicio.update({ ...set, cod_sessao: sessao.cod_sessao }, { where: { cod_sessao_exercicio: set.cod_sessao_exercicio } });
                } else {
                    await tab_sessao_exercicio.create({ ...set, cod_sessao: sessao.cod_sessao });
                }
            }
        }
    }

    for (const sessao of sessoes) {
        if (sessao.cod_sessao) {
            await tab_sessao.update(sessao, { where: { cod_sessao: sessao.cod_sessao } });
            await setSessaoExercicios(sessao, sessao.exercicios);
            sessoesAtt.push(sessao);
        } else {
            const resp = await tab_sessao.create({ ...sessao, cod_treino, cod_empresa, cod_usuario });
            await setSessaoExercicios(resp, sessao.exercicios);
            sessoesAtt.push(resp);
        }
    }

    for (const removido of removidos) {
        tab_sessao.update({ deletedAt: new Date() }, { where: { cod_sessao: removido.cod_sessao } });
    }

    res.send({ status: true, sessoes: sessoesAtt });
}

async function deleteSessao(req, res) {
    const { cod_sessao } = req.body;
    await tab_sessao.update({ deletedAt: new Date() }, { where: { cod_sessao: cod_sessao } });
    res.send({ status: true });
}

async function recoverySessao(req, res) {
    const { cod_sessao } = req.body;
    await tab_sessao.update({ deletedAt: null }, { where: { cod_sessao: cod_sessao }, paranoid: false });
    res.send({ status: true });
}

async function getEquipamentos(req, res) {
    const { cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    const equipamentos = await tab_equipamento.findAll({ where: {
        // [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ],
        // ...where
    }, paranoid: !deleted });
    res.send({ status: true, equipamentos });
}

async function getArticulacoes(req, res) {
    const { cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    const articulacoes = await tab_articulacao.findAll({ where: {
        // [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ],
        // ...where
    }, paranoid: !deleted });
    res.send({ status: true, articulacoes });
}

async function getTipoExercicios(req, res) {
    const { cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    const tipo_exercicios = await tab_tipo_exercicio.findAll({ where: {
        // [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ],
        // ...where
    }, paranoid: !deleted });
    res.send({ status: true, tipo_exercicios });
}

async function getExerciciosResistencias(req, res) {
    const { cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    const exercicios_resistencias = await tab_exercicio_resistencia.findAll({ where: {
        // [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ],
        // ...where
    }, paranoid: !deleted });
    res.send({ status: true, exercicios_resistencias });
}

async function getIndicacoes(req, res) {
    const { cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    const indicacoes = await tab_indicacao.findAll({ where: {
        // [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ],
        // ...where
    }, paranoid: !deleted });
    res.send({ status: true, indicacoes });
}

async function getPadraoesMovimentos(req, res) {
    const { cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    const padraoes_movimentos = await tab_padrao_movimento.findAll({ where: {
        // [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ],
        // ...where
    }, paranoid: !deleted });
    res.send({ status: true, padraoes_movimentos });
}

module.exports = {
    getTreinos,
    getTreino,
    setTreino,
    deleteTreino,
    getGrupoExercicios,
    setGrupoExercicio,
    deleteGrupoExercicio,
    recoveryGrupoExercicio,
    getExercicios,
    setExercicio,
    deleteExercicio,
    recoveryExercicio,
    // getSessoes,
    setSessoes,
    deleteSessao,
    recoverySessao,
    getEquipamentos,
    getArticulacoes,
    getTipoExercicios,
    getExerciciosResistencias,
    getIndicacoes,
    getPadraoesMovimentos,
}