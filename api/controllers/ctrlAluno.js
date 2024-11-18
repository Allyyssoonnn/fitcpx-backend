const { tab_aluno } = require('../../database/models');

async function getAlunos(req, res) {    
    const { cod_usuario } = req.body;
    const alunos = await tab_aluno.findAll({ where: { cod_usuario: cod_usuario } });
    res.send({ status: true, alunos });
}

module.exports = {
    getAlunos
}