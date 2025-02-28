const { Sequelize } = require('sequelize');
const { tab_plano, tab_modalidade, tab_plano_modalidade } = require('../../database/models');

async function setPlano(req, res) {    
    const { plano } = req.body;
    var planoAtt;

    if (plano.cod_plano) planoAtt = await tab_plano.findOne({ where: { cod_plano: plano.cod_plano } });

    if (planoAtt) {
        await tab_plano.update(plano, { where: { cod_plano: plano.cod_plano } });
    } else {
        const novoGrupo = await tab_plano.create(plano);
        planoAtt = novoGrupo;
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
    res.send({ status: true, planos });
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

module.exports = {
    setPlano,
    getPlanos,
    deletePlano,
    recoveryPlano,
    setModalidade,
    getModalidades,
    deleteModalidade,
    recoveryModalidade,
}