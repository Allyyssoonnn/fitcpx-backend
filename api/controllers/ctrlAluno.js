const { tab_aluno, tab_avaliacao, tab_avaliacao_imagem } = require('../../database/models');
const { removeStringVazia, uploadAlunoIMGAWS, deleteIMGAWS } = require('../../utils');

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
        include: [
            {
                model: tab_avaliacao,
                as: 'avaliacao',
                include: [
                    {
                        model: tab_avaliacao_imagem,
                        as: 'imagem',
                    }
                ]
            }
        ]
    });    
    res.send({ status: true, aluno });
}

async function setAluno(req, res) {    
    const { aluno } = req.body;
    var alunoAtt;

    if (aluno.cod_aluno) alunoAtt = await tab_aluno.findOne({ where: { cod_aluno: aluno.cod_aluno } });

    if (await tab_aluno.findOne({ where: { email_aluno: aluno.email_aluno } }) && !aluno.cod_aluno) {
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
    const aluno = await tab_aluno.findOne({ where: { cod_aluno } });
    if (aluno?.imagem_aluno) {
        if (aluno?.imagem_aluno?.includes('amazonaws.com')) {
            const id = aluno.imagem_aluno.substring(aluno.imagem_aluno.indexOf('perfil/') + 7, aluno.imagem_aluno.length);
            const removida = await deleteIMGAWS(id);
        }
    }
    const fileId = await uploadAlunoIMGAWS(req.file.path, req.file.mimetype);
    aluno.imagem_aluno = fileId;
    aluno.save();

    res.send({ status: true, id: fileId });
}

async function sendAvaliacaoIMG(req, res) {
    const cod_avaliacao = req.headers['cod_avaliacao'];
    const deletedimages = JSON.parse(req.headers['deletedimages']);

    Object.entries(deletedimages).forEach(async ([key, imageData]) => {
        const id = imageData.substring(imageData.indexOf('perfil/') + 7, imageData.length);
        const removida = await deleteIMGAWS(id);
        if (removida) tab_avaliacao_imagem.update({ deletedAt: new Date() }, { where: { url_imagem: imageData } });
    });

    for (const file of req.files) {
        const url = await uploadAlunoIMGAWS(file.path, file.mimetype);
        const descricao = file.originalname.substring(0, file.originalname.indexOf('_'));
        await tab_avaliacao_imagem.create({
            cod_avaliacao,
            descricao_imagem: descricao,
            url_imagem: url
        });
    }

    res.send({ status: true });
}

module.exports = {
    getAlunos,
    getAluno,
    setAluno,
    getAvaliacao,
    setAvaliacao,
    changeAlunoIMG,
    sendAvaliacaoIMG,
}