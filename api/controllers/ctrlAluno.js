const { tab_aluno } = require('../../database/models');

async function getAlunos(req, res) {    
    const { cod_usuario } = req.body;
    const alunos = await tab_aluno.findAll({ where: { cod_usuario: cod_usuario } });
    res.send({ status: true, alunos });
}

async function getAluno(req, res) {    
    const { cod_aluno } = req.body;
    const aluno = await tab_aluno.findOne({ where: { cod_aluno: cod_aluno } });
    res.send({ status: true, aluno });
}

async function setAluno(req, res) {    
    const { aluno } = req.body;
    var alunoAtt;

    if (aluno.cod_aluno) alunoAtt = await tab_aluno.findOne({ where: { cod_aluno: aluno.cod_aluno } });

    if (alunoAtt) {
        await tab_aluno.update(aluno, { where: { cod_aluno: aluno.cod_aluno } });
    } else {
        const novoAluno = await tab_aluno.create(aluno);
        alunoAtt = novoAluno;
    }

    res.send({ status: true, aluno: alunoAtt });
}

module.exports = {
    getAlunos,
    getAluno,
    setAluno
}