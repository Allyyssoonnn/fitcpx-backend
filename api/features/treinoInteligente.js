const { Sequelize, Op } = require('sequelize');
const { tab_exercicio } = require('../../database/models');

async function generateTreino(req, res) {
    const { data } = req.body;

    const {
        gruposSelecionados,
        indicacoesSelecionados,
        equipamentosSelecionados,
        desenvolvimento,
        duracao,
    } = data;

    const codIndicacoes = indicacoesSelecionados.map(indicacao => indicacao.cod_indicacao);
    const codEquipamentos = equipamentosSelecionados.map(equipamento => equipamento.cod_equipamento);

    for (const grupo of gruposSelecionados) {
        const whereClause = {};
    
        whereClause[Op.or] = [
            { cod_grupo_exercicio_1: { [Op.in]: [grupo.cod_grupo_exercicio] } },
            // { cod_grupo_exercicio_2: { [Op.in]: [grupo.cod_grupo_exercicio] } },
            // { cod_grupo_exercicio_3: { [Op.in]: [grupo.cod_grupo_exercicio] } },
            // { cod_grupo_exercicio_4: { [Op.in]: [grupo.cod_grupo_exercicio] } },
            // { cod_grupo_exercicio_5: { [Op.in]: [grupo.cod_grupo_exercicio] } },
            // { cod_grupo_exercicio_6: { [Op.in]: [grupo.cod_grupo_exercicio] } },
            // { cod_grupo_exercicio_7: { [Op.in]: [grupo.cod_grupo_exercicio] } },
            // { cod_grupo_exercicio_8: { [Op.in]: [grupo.cod_grupo_exercicio] } }
        ];
        // if (codIndicacoes.length > 0) whereClause.cod_indicacao = { [Op.in]: codIndicacoes };
        if (codEquipamentos.length > 0) whereClause.cod_equipamento = { [Op.notIn]: codEquipamentos };

        const exercicios = await tab_exercicio.findAll({
            where: whereClause
        });
        // Transformando em um array normal
        const exerciciosArray = exercicios.map(exercicio => exercicio.toJSON());
        grupo.exercicios = exerciciosArray;
    }

    const gruposComTreino = await generateSessao(gruposSelecionados, codIndicacoes, desenvolvimento, duracao);

    var sessao = [];
    for (const grupo of gruposComTreino) sessao = [ ...sessao, ...grupo.treino ];
    sessao = sessao.map((exc, i) => ({ ...exc, sequencia_sessao_exercicio: i + 1 }));

    res.send({ status: true, sessao });
}

const tabReferencia = {
    "Força": { minSeries: 3, maxSeries: 6, minRep: 1, maxRep: 6, descanso: 120, exerciciosPorGrupo: 3 },
    "Hipertrofia": { minSeries: 3, maxSeries: 5, minRep: 6, maxRep: 12, descanso: 60, exerciciosPorGrupo: 4 },
    "Resistência": { minSeries: 2, maxSeries: 4, minRep: 12, maxRep: 20, descanso: 30, exerciciosPorGrupo: 5 },
};

function parseDuracao(duracao) {
    const [horas, minutos] = duracao.split(":").map(Number);
    return horas * 60 + minutos; // Converte para minutos totais
}

// Função para embaralhar um array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function generateSessao(gruposSelecionados, codIndicacoes, desenvolvimento, duracao) {
    let tempoTotal = 0; // Tempo total do treino acumulado (em segundos)
    const tempoMaximo = parseDuracao(duracao) * 60; // Converter minutos para segundos

    for (const grupo of gruposSelecionados) {
        const { exercicios, series } = grupo;
        grupo.treino = [];
        grupo.seriesTotais = 0;

        const ref = tabReferencia[desenvolvimento];

        // Separar os exercícios indicados e os não indicados
        let exerciciosIndicados = exercicios.filter(ex => codIndicacoes.includes(ex.cod_indicacao));
        let exerciciosNaoIndicados = exercicios.filter(ex => !codIndicacoes.includes(ex.cod_indicacao));

        // Embaralhar os arrays para garantir aleatoriedade
        exerciciosIndicados = shuffleArray(exerciciosIndicados);
        exerciciosNaoIndicados = shuffleArray(exerciciosNaoIndicados);

        // Criar um array com prioridade para indicados, mas incluindo outros se necessário
        let listaExercicios = [...exerciciosIndicados, ...exerciciosNaoIndicados];

        // Determinar o número ideal de exercícios para atingir exatamente `series`
        let numExercicios = 1;
        while (numExercicios < listaExercicios.length) {
            const mediaSeries = Math.floor(series / numExercicios);
            if (mediaSeries >= ref.minSeries && mediaSeries <= ref.maxSeries) break;
            numExercicios++;
        }

        // Selecionar os exercícios necessários
        listaExercicios = listaExercicios.slice(0, numExercicios);

        // Distribuir o total de séries exatamente igual a `series`
        let seriesRestantes = series;

        for (const exercicio of listaExercicios) {
            if (tempoTotal >= tempoMaximo) break; // Parar se já atingiu o tempo máximo

            // Definir quantas séries esse exercício terá, garantindo que a soma seja exata
            let seriesPorExercicio = Math.min(seriesRestantes, ref.maxSeries);
            // if (seriesPorExercicio < ref.minSeries) continue; // Pular caso fique abaixo do mínimo

            // Determinar o número médio de repetições
            const numReps = Math.floor((ref.minRep + ref.maxRep) / 2);

            // Calcular tempo necessário para esse exercício (tempo de execução + descanso)
            const tempoExecucao = exercicio.segundos_execucao * numReps * seriesPorExercicio;
            const tempoDescanso = ref.descanso * (seriesPorExercicio - 1); // Descanso entre as séries

            const tempoTotalExercicio = tempoExecucao + tempoDescanso;

            // Se adicionar esse exercício estourar o tempo total, sai do loop
            if (tempoTotal + tempoTotalExercicio > tempoMaximo) continue;

            // Adicionar exercício à sessão
            grupo.treino.push({
                ...exercicio,
                sets: [],
                carga_sessao_exercicio: 0,
                serie_sessao_exercicio: seriesPorExercicio,
                repeticao_sessao_exercicio: numReps,
                intervalo_sessao_exercicio: ref.descanso,
                exerciciosFiltros: exercicios,
                tempo_execucao: tempoTotalExercicio,
            });

            grupo.seriesTotais += seriesPorExercicio;

            // Atualizar o tempo total do treino
            tempoTotal += tempoExecucao;
        }
    }
    return gruposSelecionados;
}

module.exports = {
    generateTreino,
}