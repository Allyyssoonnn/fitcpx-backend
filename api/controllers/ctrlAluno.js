const { Sequelize } = require('sequelize');
const { tab_aluno, tab_avaliacao, tab_avaliacao_imagem, tab_usuario, tab_empresa } = require('../../database/models');
const { removeStringVazia } = require('../../utils');

async function getAlunos(req, res) {    
    const { cod_usuario, cod_empresa, deleted } = req.body;
    const where = deleted ? { deletedAt: { [Sequelize.Op.ne]: null } } : { deletedAt: null };
    const alunos = await tab_aluno.findAll({
        where: where,
        paranoid: !deleted,
        include: [
            { model: tab_avaliacao, as: 'avaliacao' },
            { model: tab_usuario, as: 'usuario', where: { cod_empresa } },
        ],
        attributes: { exclude: ['senha_aluno'] },
        order: [['nome_aluno', 'ASC']]
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

    if (aluno?.cod_aluno) alunoAtt = await tab_aluno.findOne({ where: { cod_aluno: aluno.cod_aluno } });

    if (await tab_aluno.findOne({ where: { email_aluno: aluno.email_aluno } }) && !aluno.cod_aluno) {
        res.send({ status: false, msg: 'E-mail já cadastrado!' });
        return;
    }

    if (await tab_aluno.findOne({ where: { cpf_aluno: aluno.cpf_aluno } }) && !aluno.cod_aluno) {
        res.send({ status: false, msg: 'CPF já cadastrado!' });
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

async function deleteAluno(req, res) {
    const { cod_aluno } = req.body;
    await tab_aluno.update({ deletedAt: new Date() }, { where: { cod_aluno: cod_aluno } });
    res.send({ status: true });
}

async function recoveryAluno(req, res) {
    const { cod_aluno } = req.body;
    await tab_aluno.update({ deletedAt: null }, { where: { cod_aluno: cod_aluno }, paranoid: false });
    res.send({ status: true });
}

async function getAvaliacoes(req, res) {    
    const { cod_empresa, cod_aluno } = req.body;
    const whereEmpresa = cod_empresa ? { cod_empresa } : null;
    const whereAluno = cod_aluno ? { cod_aluno } : null;

    const avaliacoes = await tab_avaliacao.findAll({
        include: [
            {
                model: tab_aluno,
                as: 'aluno',
                required: true,
                where: whereAluno,
                include: [
                    {
                        model: tab_usuario,
                        as: 'usuario',
                        required: true,
                        include: [
                            {
                                model: tab_empresa,
                                as: 'empresa',
                                required: true,
                                where: whereEmpresa,
                            }
                        ]
                    }
                ],
            },
            {
                model: tab_avaliacao_imagem,
                as: 'imagem',
            }
        ],
    });
    const avaliacoesLimpa = avaliacoes.map(avaliacao => avaliacao.toJSON());
    // for (const av of avaliacoes) av.nome_aluno = av.aluno.nome_aluno;
    // Reorganizando os dados para que nome_aluno seja o primeiro atributo
    const avaliacoesFormatadas = avaliacoesLimpa.map(av => ({
        nome_aluno: av.aluno?.nome_aluno, // Primeiro atributo
        ...av, // Outros atributos
    }));
    res.send({ status: true, avaliacoes: avaliacoesFormatadas });
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

async function deleteAvaliacao(req, res) {
    const { cod_avaliacao } = req.body;
    await tab_avaliacao.update({ deletedAt: new Date() }, { where: { cod_avaliacao: cod_avaliacao } });
    res.send({ status: true });
}

module.exports = {
    getAlunos,
    getAluno,
    setAluno,
    deleteAluno,
    recoveryAluno,
    getAvaliacoes,
    getAvaliacao,
    setAvaliacao,
    deleteAvaliacao,
}