const { Sequelize } = require('sequelize');
const { tab_plano, tab_modalidade, tab_plano_modalidade, tab_contrato } = require('../../database/models');

async function setPlano(req, res) {    
    const { plano, modalidades } = req.body;
    var planoAtt;

    if (plano.cod_plano) planoAtt = await tab_plano.findOne({ where: { cod_plano: plano.cod_plano } });

    if (planoAtt) {
        await tab_plano.update(plano, { where: { cod_plano: plano.cod_plano } });
        //Se já existir registro vai comparar as modalidades para remover ou adicionar se necessário
        const modalidadesBD = await tab_plano_modalidade.findAll({ where: { cod_plano: plano.cod_plano } });
        
        const modalidadesBDIds = modalidadesBD.map(m => m.cod_modalidade);
        const modalidadesReqIds = modalidades.map(m => m.cod_modalidade);

        // Modalidades a serem removidas
        const modalidadesParaRemover = modalidadesBDIds.filter(id => !modalidadesReqIds.includes(id));
        if (modalidadesParaRemover.length) {
            await tab_plano_modalidade.destroy({
                where: { cod_plano: plano.cod_plano, cod_modalidade: modalidadesParaRemover }
            });
        }

        // Modalidades a serem adicionadas
        const modalidadesParaAdicionar = modalidadesReqIds.filter(id => !modalidadesBDIds.includes(id));
        if (modalidadesParaAdicionar.length) {
            const novasModalidades = modalidadesParaAdicionar.map(id => ({
                cod_plano: plano.cod_plano,
                cod_modalidade: id
            }));
            await tab_plano_modalidade.bulkCreate(novasModalidades);
        }
    } else {
        const novoPlano = await tab_plano.create(plano);
        planoAtt = novoPlano;

        if (modalidades.length) {
            const novasModalidades = modalidades.map(m => ({
                cod_plano: planoAtt.cod_plano,
                cod_modalidade: m.cod_modalidade
            }));
            await tab_plano_modalidade.bulkCreate(novasModalidades);
        }
    }

    res.send({ status: true });
}

async function getPlanos(req, res) {
    const { cod_empresa, deleted } = req.body;
    var where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    if (cod_empresa) where = { ...where, [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ] };
    const planos = await tab_plano.findAll({
        where: where,
        include: [
            {
                model: tab_plano_modalidade,
                as: 'modalidades',
                include: [
                    {
                        model: tab_modalidade,
                        as: 'modalidade',
                    },
                ],
            },
        ],
        paranoid: !deleted
    });

    const planosLimpo = planos.map((plano) => plano.toJSON());
    for (const plano of planosLimpo) {
        plano.modalidades = plano.modalidades.map((modalidade) => ({ ...modalidade, ...modalidade.modalidade }));
    }

    res.send({ status: true, planos: planosLimpo });
}

async function deletePlano(req, res) {
    const { cod_plano } = req.body;
    await tab_plano.update({ deletedAt: new Date() }, { where: { cod_plano: cod_plano } });
    res.send({ status: true });
}

async function recoveryPlano(req, res) {
    const { cod_plano } = req.body;
    await tab_plano.update({ deletedAt: null }, { where: { cod_plano: cod_plano }, paranoid: false });
    res.send({ status: true });
}

async function setModalidade(req, res) {    
    const { modalidade } = req.body;
    var modalidadeAtt;

    if (modalidade.cod_modalidade) modalidadeAtt = await tab_modalidade.findOne({ where: { cod_modalidade: modalidade.cod_modalidade } });

    if (modalidadeAtt) {
        await tab_modalidade.update(modalidade, { where: { cod_modalidade: modalidade.cod_modalidade } });
    } else {
        const novoGrupo = await tab_modalidade.create(modalidade);
        modalidadeAtt = novoGrupo;
    }

    res.send({ status: true });
}

async function getModalidades(req, res) {
    const { cod_empresa, deleted } = req.body;
    var where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    if (cod_empresa) where = { ...where, [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ] };
    const modalidades = await tab_modalidade.findAll({ where: where, paranoid: !deleted });
    res.send({ status: true, modalidades });
}

async function deleteModalidade(req, res) {
    const { cod_modalidade } = req.body;
    await tab_modalidade.update({ deletedAt: new Date() }, { where: { cod_modalidade: cod_modalidade } });
    res.send({ status: true });
}

async function recoveryModalidade(req, res) {
    const { cod_modalidade } = req.body;
    await tab_modalidade.update({ deletedAt: null }, { where: { cod_modalidade: cod_modalidade }, paranoid: false });
    res.send({ status: true });
}

async function setContrato(req, res) {    
    const { contrato } = req.body;
    var contratoAtt;

    if (contrato.cod_contrato) contratoAtt = await tab_contrato.findOne({ where: { cod_contrato: contrato.cod_contrato } });

    if (contratoAtt) {
        await tab_contrato.update(contrato, { where: { cod_contrato: contrato.cod_contrato } });
    } else {
        const novoContrato = await tab_contrato.create(contrato);
        contratoAtt = novoContrato;
    }

    res.send({ status: true });
}

async function getContratos(req, res) {
    const { cod_empresa, deleted } = req.body;
    var where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : {};
    if (cod_empresa) where = { ...where, [Sequelize.Op.or]: [ { cod_empresa: cod_empresa }, { cod_empresa: null } ] };
    const contratos = await tab_contrato.findAll({ where: where, paranoid: !deleted });
    res.send({ status: true, contratos });
}

async function deleteContrato(req, res) {
    const { cod_contrato } = req.body;
    await tab_contrato.update({ deletedAt: new Date() }, { where: { cod_contrato: cod_contrato } });
    res.send({ status: true });
}

async function recoveryContrato(req, res) {
    const { cod_contrato } = req.body;
    await tab_contrato.update({ deletedAt: null }, { where: { cod_contrato: cod_contrato }, paranoid: false });
    res.send({ status: true });
}

module.exports = {
    setPlano,
    getPlanos,
    deletePlano,
    recoveryPlano,
    setModalidade,
    getModalidades,
    deleteModalidade,
    recoveryModalidade,
    setContrato,
    getContratos,
    deleteContrato,
    recoveryContrato,
}