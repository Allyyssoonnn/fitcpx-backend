const {
    tab_aluno,
    tab_empresa,
    tab_refreshtoken_aluno,
    tab_treino_execucao,
    tab_treino_execucao_exercicio,
} = require("../../database/models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const dev = env === "development";

async function login(req, res) {
    const { login, senha } = req.body;

    const aluno = await tab_aluno.findOne({
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        { email_aluno: login.trim() },
                        { cpf_aluno: login.trim() },
                    ],
                },
                { deletedAt: null },
            ],
        },
    });

    if (!aluno) {
        res.send({ status: true, msg: "CPF ou E-mail não cadastrado!" });
        return;
    }

    if (aluno.senha_aluno !== senha) {
        res.send({ status: true, msg: "Senha incorreta!" });
        return;
    }

    const empresa = await tab_empresa.findOne({
        where: { cod_empresa: aluno.cod_empresa },
    });

    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const expirationTime = 7 * 24 * 60 * 60 * 1000; // Exemplo: 7 dias em milissegundos
    const expiresAt = new Date(Date.now() + expirationTime);

    const token = jwt.sign({ cod_aluno: aluno.cod_aluno }, process.env.SECRET, {
        expiresIn: "7h",
    });
    const refreshToken = crypto.randomBytes(64).toString("hex");
    tab_refreshtoken_aluno.create({
        cod_aluno: aluno.cod_aluno,
        refreshtoken_aluno: refreshToken,
        useragent_aluno: userAgent,
        ip_aluno: ipAddress,
        expiresAt: expiresAt,
    });
    if (dev) {
        console.log(`Aluno [${aluno.nome_aluno}] logado com sucesso!`);
        console.log(`Token ${token}`);
    }
    res.send({ status: true, token, refreshToken, aluno, empresa });
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(403).send({
            status: false,
            msg: "Token de atualização não fornecido!",
        });

    const refreshTokenValido = await tab_refreshtoken_aluno.findOne({
        where: {
            refreshtoken_aluno: refreshToken,
            expiresAt: {
                [Op.gte]: new Date(),
            },
        },
    });

    const refreshTokenExpirado = await tab_refreshtoken_aluno.findOne({
        where: {
            refreshtoken_aluno: refreshToken,
            expiresAt: {
                [Op.lt]: new Date(), // Verifica se a data de expiração é menor que a data atual
            },
        },
    });
    if (refreshTokenExpirado)
        await tab_refreshtoken_aluno.update(
            { deletedAt: new Date() },
            {
                where: {
                    cod_refreshtoken_aluno:
                        refreshTokenExpirado.cod_refreshtoken_aluno,
                },
            }
        );

    if (!refreshTokenValido) {
        return res.status(403).send({ status: false, msg: "Token inválido!" });
    }

    const usuario = await tab_aluno.findOne({
        where: { cod_aluno: refreshTokenValido.cod_aluno },
    });

    const newToken = jwt.sign(
        { email: usuario.email_usuario },
        process.env.SECRET,
        { expiresIn: "7h" }
    );
    res.send({ status: true, token: newToken });
}

async function finishTreino(req, res) {
    const { sessao, tempo, cod_aluno } = req.body;

    const treino_execucao = await tab_treino_execucao.create({
        cod_treino: sessao.cod_treino,
        cod_sessao: sessao.cod_sessao,
        cod_aluno: sessao.cod_aluno ?? cod_aluno,
        duracao_treino_execucao: tempo,
        data_treino_execucao: new Date(),
    });

    for (const exercicio of sessao.exercicios) {
        await tab_treino_execucao_exercicio.create({
            cod_treino_execucao: treino_execucao.cod_treino_execucao,
            cod_exercicio: exercicio?.cod_exercicio,
            treino_exercicio_executado:
                exercicio.feito != undefined
                    ? exercicio.feito
                        ? "S"
                        : "N"
                    : exercicio?.setsInfo?.every((set) => set.checked)
                    ? "S"
                    : "N",
            execucao_treino_execucao_exercicio: exercicio?.execucoes
                ? JSON.stringify(exercicio?.execucoes)
                : JSON.stringify(exercicio.setsInfo),

            sequencia_treino_execucao_exercicio:
                exercicio?.sequencia_sessao_exercicio,
            serie_treino_execucao_exercicio: exercicio?.serie_sessao_exercicio,
            repeticao_treino_execucao_exercicio:
                exercicio?.repeticao_sessao_exercicio,
            carga_treino_execucao_exercicio: exercicio?.carga_sessao_exercicio,
            observacao_treino_execucao_exercicio:
                exercicio?.observacao_sessao_exercicio ?? "",
            // intervalo_treino_execucao_exercicio:
            //     exercicio?.intervalo_sessao_exercicio,
            //Não estou salvando
            intervalo_treino_execucao_exercicio: 0,
        });
    }

    res.send({ status: true });
}

async function getTreinosRealizados(req, res) {
    const { cod_aluno } = req.body;

    if (cod_aluno) where = { cod_aluno: cod_aluno };

    const treinos = await tab_treino_execucao.findAll({
        where: where,
        include: [
            {
                model: tab_treino_execucao_exercicio,
                as: "exercicios",
            },
        ],
    });

    res.send({ status: true, treinos });
}

module.exports = {
    login,
    refreshToken,
    finishTreino,
    getTreinosRealizados,
};
