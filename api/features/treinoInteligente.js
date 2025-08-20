const { Sequelize, Op } = require("sequelize");
const { tab_exercicio, tab_aluno, tab_avaliacao } = require("../../database/models");
const { calcularIdade } = require("../../utils");
const fs = require("fs");

const OpenAI = require("openai");
const { getResultPhysicalFunc } = require("../controllers/ctrlAvaliacao");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTreino(req, res) {
  const { data } = req.body;

  const {
    cod_aluno,
    gruposSelecionados,
    indicacoesSelecionadas,
    aquecimento,
    // equipamentosSelecionados,
    // desenvolvimento,
    // duracao,
  } = data;

  const aluno = await tab_aluno.findByPk(cod_aluno);
  const avaliacao = (await tab_avaliacao.findAll({ where: { cod_aluno } }))[0];

  const resultPhysical = avaliacao ? await getResultPhysicalFunc(aluno, avaliacao) : null;

  const codIndicacoes = indicacoesSelecionadas.map((indicacao) => indicacao.cod_indicacao);
  // const codEquipamentos = equipamentosSelecionados.map(equipamento => equipamento.cod_equipamento);

  for (const grupo of gruposSelecionados) {
    const whereClause = {};
    const { value: cod_grupo_exercicio, cod_articulacao, cod_exercicio_resistencia, cod_padrao_movimento, cod_tipo_exercicio } = grupo;

    whereClause[Op.or] = [
      { cod_grupo_exercicio_1: { [Op.in]: [cod_grupo_exercicio] } },
      //   { cod_articulacao: { [Op.in]: [cod_articulacao] } },
      //   { cod_exercicio_resistencia: { [Op.in]: [cod_exercicio_resistencia] } },
      //   { cod_padrao_movimento: { [Op.in]: [cod_padrao_movimento] } },
      //   { cod_tipo_exercicio: { [Op.in]: [cod_tipo_exercicio] } },
      // { cod_grupo_exercicio_2: { [Op.in]: [grupo.cod_grupo_exercicio] } },
      //....
    ];
    // if (codIndicacoes.length > 0) whereClause.cod_indicacao = { [Op.in]: codIndicacoes };
    // if (codEquipamentos.length > 0) whereClause.cod_equipamento = { [Op.notIn]: codEquipamentos };

    const exercicios = await tab_exercicio.findAll({
      where: whereClause,
      attributes: [
        ["cod_exercicio", "id"],
        ["nome_exercicio", "name"],
      ],
    });
    // Transformando em um array normal
    const exerciciosArray = exercicios.map((exercicio) => exercicio.toJSON());
    grupo.exercicios = exerciciosArray;
  }

  let exerciseList = [];

  for (const grupo of gruposSelecionados) exerciseList = [...exerciseList, ...grupo.exercicios];

  var sessao = [];

  var prompt = await getPromptAI(aluno, exerciseList, resultPhysical);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  let content = response.choices[0].message.content;

  // Remove blocos de crase e espaços extras
  content = content.replace(/```json\n?|```\n?/g, "").trim();

  try {
    content = JSON.parse(content);
  } catch (err) {
    console.error("Erro ao parsear JSON:", err, content);
  }

  fs.writeFileSync(`prompt_${aluno?.cod_aluno}.txt`, prompt);
  fs.writeFileSync(`response_${aluno?.cod_aluno}.txt`, JSON.stringify(content));

  for (const exercise of content.session.exercises) {
    sessao.push({
      cod_exercicio: exercise.id,
      sets: exercise.sets.map((set) => ({
        id: set.id,
        repeticao_sessao_exercicio: set.repetitions,
        intervalo_sessao_exercicio: set.interval,
        carga_sessao_exercicio: set.weight,
        serie_sessao_exercicio: set.qtdSets,
      })),
      carga_sessao_exercicio: exercise.weight,
      serie_sessao_exercicio: exercise.qtdSets,
      repeticao_sessao_exercicio: exercise.repetitions,
      intervalo_sessao_exercicio: exercise.interval,
    });
  }

  res.send({ status: true, sessao });
}

async function getPromptAI(client, exercises, resultPhysical) {
  const clientJson = JSON.stringify({
    name: client.nome_aluno,
    gender: client.sexo_aluno,
    age: calcularIdade(client.data_nascimento_aluno),
    objective: "Força",
  });
  let physical = null;
  if (resultPhysical) {
    physical = {
      weight: resultPhysical.peso,
      height: resultPhysical.altura,
      basalMetabolism: resultPhysical.basal,
      bodyFatPercentage: resultPhysical.compositionPercentage.gordura,
      bodyFatWeight: resultPhysical.compositionWeight.gordura,
      musclePercentage: resultPhysical.compositionPercentage.massa_muscular,
      muscleWeight: resultPhysical.compositionWeight.massa_muscular,
      leanMassPercentage: resultPhysical.compositionPercentage.massa_magra,
      leanMassWeight: resultPhysical.compositionWeight.massa_magra,
    };
  }

  let prompt = `
    Crie um Treino Personalizado
    Para criar um treino personalizado eficaz, considere vários fatores, incluindo seus objetivos fitness, nível de condicionamento físico atual, preferências de exercícios e limitações físicas (se houver). Por favor, a partir das seguintes informações crie um plano de treino personalizado.
    Selecione os exercícios com base na tabela de exercícios fornecida

    ${clientJson}

    ${physical ? JSON.stringify(physical) : ""}

    O retorno deve ser um JSON formatado como no exemplo abaixo, o array sets são para exercicios Bi-set, Tri-set etc..., enviar vazio [] quando não existir
    Retorne apenas o JSON, sem explicações, Somente o JSON

    {
        "session": {
            "exercises": [
                {
                    "id": "Exercise ID",
                    "repetitions": "Repetitions - int Field",
                    "interval": "Interval seconds",
                    "weight": "Weight - int Field",
                    "observation": "Observation text",
                    "qtdSets": "Number of Sets - int Field",
                    "sets": [
                        {
                            "id": "Exercise ID",
                            "repetitions": "Repetitions - int Field",
                            "interval": "Interval seconds",
                            "weight": "Weight - int Field"
                            "observation": "Observation text",
                            "qtdSets": "Number of Sets - int Field",
                        }
                    ]
                }
            ]
        }
    }

    JSON de Exercícios

    ${JSON.stringify(exercises)}
  `;

  return prompt;
}

module.exports = {
  generateTreino,
};
