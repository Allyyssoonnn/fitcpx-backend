const { tab_aluno } = require('../../database/models');
const { tab_avaliacao } = require('../../database/models');
const { removeStringVazia, uploadAlunoIMGAWS } = require('../../utils');

async function getAlunos(req, res) {    
    const { cod_usuario } = req.body;
    const alunos = await tab_aluno.findAll({
        where: { cod_usuario: cod_usuario },
        include: [{ model: tab_avaliacao, as: 'avaliacao' }]
    });
    res.send({ status: true, alunos });
}

async function getAluno(req, res) {    
    const { cod_aluno } = req.body;
    const aluno = await tab_aluno.findOne({
        where: { cod_aluno: cod_aluno },
        include: [{ model: tab_avaliacao, as: 'avaliacao' }]
    });
    res.send({ status: true, aluno });
}

async function setAluno(req, res) {    
    const { aluno } = req.body;
    var alunoAtt;

    if (aluno.cod_aluno) alunoAtt = await tab_aluno.findOne({ where: { cod_aluno: aluno.cod_aluno } });

    if (await tab_aluno.findOne({ where: { email_aluno: aluno.email_aluno } })) {
        res.send({ status: false, msg: 'E-mail já cadastrado!' });
        return;
    }

    if (alunoAtt) {
        await tab_aluno.update(aluno, { where: { cod_aluno: aluno.cod_aluno } });
    } else {
        const novoAluno = await tab_aluno.create(aluno);
        alunoAtt = novoAluno;
    }
    res.send({ status: true, aluno: alunoAtt });
}

async function getAvaliacao(req, res) {    
    const { cod_avaliacao } = req.body;
    const avaliacao = await tab_avaliacao.findOne({ where: { cod_avaliacao: cod_avaliacao } });
    res.send({ status: true, avaliacao });
}

async function setAvaliacao(req, res) {    
    const { avaliacao: avaliacaoReq } = req.body;
    var avaliacaoAtt;

    const avaliacao = removeStringVazia(avaliacaoReq);

    if (avaliacao.cod_avaliacao) avaliacaoAtt = await tab_avaliacao.findOne({ where: { cod_aluno: avaliacao.cod_aluno } });

    if (avaliacaoAtt) {
        await tab_avaliacao.update(avaliacao, { where: { cod_avaliacao: avaliacao.cod_avaliacao } });
    } else {
        const novoAluno = await tab_avaliacao.create(avaliacao);
        avaliacaoAtt = novoAluno;
    }

    res.send({ status: true, avaliacao: avaliacaoAtt });
}

async function changeAlunoIMG(req, res) {
    const cod_aluno = req.headers['cod_aluno'];
    const fileId = await uploadAlunoIMGAWS(req.file.path, req.file.mimetype);
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
    aluno.imagem_aluno = fileId;
    aluno.save();

    res.send({ status: true, id: fileId });
}

module.exports = {
    getAlunos,
    getAluno,
    setAluno,
    getAvaliacao,
    setAvaliacao,
    changeAlunoIMG,
}