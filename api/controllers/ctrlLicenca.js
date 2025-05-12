const { tab_licenca, tab_empresa_licenca, tab_licenca_variacao } = require('../../database/models');

async function getLicencas(req, res) {    
    const licencas = await tab_licenca.findAll({
        include: [
            {
                model: tab_licenca_variacao,
                as: 'licencaVariacao'
            },
        ],
        where: { visivel_licenca: 'S' },
        order: [[{ model: tab_licenca_variacao, as: 'licencaVariacao' }, 'sequencia_licenca_variacao', 'ASC']],
    });
    res.send({ status: true, licencas });
}

async function getLicenca(req, res) {    
    const { cod_empresa } = req.body;

    const licenca = await tab_empresa_licenca.findOne({
        include: [
            {
                model: tab_licenca,
                as: 'licenca'
            },
            {
                model: tab_licenca_variacao,
                as: 'licencaVariacao'
            },
        ],
        where: { cod_empresa }
    });

    const licencaData = licenca.get({ plain: true });
    const licencaResp = {
        ...licencaData,
        ...licencaData.licenca,
        licencaVariacao: licencaData.licencaVariacao,
    }

    res.send({ status: true, licenca: licencaResp });
}

module.exports = {
    getLicencas,
    getLicenca,
}