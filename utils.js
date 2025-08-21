function removeStringVazia(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value === "" ? null : value]));
}

// Função para formatar número de celular para o padrão internacional E.164
function formatarCelular(numeroCelular) {
  // Remove todos os caracteres não numéricos
  let numero = numeroCelular.replace(/\D/g, "");

  // Verifica se o número já tem o código do país
  if (!numero.startsWith("55")) {
    // Adiciona o código do país (Brasil - 55)
    numero = "55" + numero;
  }

  // Verifica se o DDD tem o 0 na frente e remove (ex: 011 -> 11)
  if (numero.startsWith("550")) {
    numero = "55" + numero.substring(3);
  }

  // Verifica se é um celular e tem o nono dígito
  if (numero.length === 12) {
    // Sem o nono dígito (55 + DDD + 8 dígitos)
    // Insere o nono dígito (9) após o DDD para celulares no Brasil
    numero = numero.substring(0, 4) + "9" + numero.substring(4);
  }

  // Formato final: +55DDNNNNNNNNN
  return "+" + numero;
}

function calcularIdadeDtAvaliacao(dataNascimento, dataAvaliacao) {
  if (!dataNascimento) return "-";
  const hoje = new Date(dataAvaliacao);
  const nascimento = new Date(dataNascimento);

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  // Ajusta a idade se ainda não tiver feito aniversário neste ano
  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();
  const mesNascimento = nascimento.getMonth();
  const diaNascimento = nascimento.getDate();

  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade--;
  }

  return idade;
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return "-";
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  // Ajusta a idade se ainda não tiver feito aniversário neste ano
  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();
  const mesNascimento = nascimento.getMonth();
  const diaNascimento = nascimento.getDate();

  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade--;
  }

  return idade;
}

function getReferenceWorkout(nivel, valencia, volume) {
  const tabelaTreino = [
    // Iniciante
    { nivel: "Iniciante", valencia: "Força", series: 4, repeticoes: 6, intervalo: 120, volume: "Baixo", nExercicios: 3, tempo: "30-45", VT: 12, VTT: 72 },
    { nivel: "Iniciante", valencia: "Força", series: 4, repeticoes: 6, intervalo: 120, volume: "Médio", nExercicios: 3, tempo: "45-60", VT: 12, VTT: 72 },
    { nivel: "Iniciante", valencia: "Força", series: 4, repeticoes: 6, intervalo: 120, volume: "Alto", nExercicios: 4, tempo: "60-75", VT: 16, VTT: 96 },

    { nivel: "Iniciante", valencia: "Hipertrofia", series: 3, repeticoes: 12, intervalo: 90, volume: "Baixo", nExercicios: 3, tempo: "30-45", VT: 9, VTT: 108 },
    { nivel: "Iniciante", valencia: "Hipertrofia", series: 3, repeticoes: 12, intervalo: 90, volume: "Médio", nExercicios: 4, tempo: "45-60", VT: 12, VTT: 144 },
    { nivel: "Iniciante", valencia: "Hipertrofia", series: 3, repeticoes: 12, intervalo: 90, volume: "Alto", nExercicios: 5, tempo: "60-75", VT: 15, VTT: 180 },

    { nivel: "Iniciante", valencia: "Resistência", series: 2, repeticoes: 20, intervalo: 40, volume: "Baixo", nExercicios: 4, tempo: "25-40", VT: 8, VTT: 160 },
    { nivel: "Iniciante", valencia: "Resistência", series: 2, repeticoes: 20, intervalo: 40, volume: "Médio", nExercicios: 5, tempo: "35-50", VT: 10, VTT: 200 },
    { nivel: "Iniciante", valencia: "Resistência", series: 2, repeticoes: 20, intervalo: 40, volume: "Alto", nExercicios: 6, tempo: "45-65", VT: 12, VTT: 240 },

    // Intermediário
    { nivel: "Intermediário", valencia: "Força", series: 5, repeticoes: 6, intervalo: 120, volume: "Baixo", nExercicios: 3, tempo: "45-60", VT: 15, VTT: 90 },
    { nivel: "Intermediário", valencia: "Força", series: 5, repeticoes: 6, intervalo: 120, volume: "Médio", nExercicios: 4, tempo: "60-75", VT: 20, VTT: 120 },
    { nivel: "Intermediário", valencia: "Força", series: 5, repeticoes: 6, intervalo: 120, volume: "Alto", nExercicios: 5, tempo: "75-90", VT: 25, VTT: 150 },

    { nivel: "Intermediário", valencia: "Hipertrofia", series: 4, repeticoes: 12, intervalo: 90, volume: "Baixo", nExercicios: 4, tempo: "45-60", VT: 16, VTT: 192 },
    { nivel: "Intermediário", valencia: "Hipertrofia", series: 4, repeticoes: 12, intervalo: 90, volume: "Médio", nExercicios: 5, tempo: "60-75", VT: 20, VTT: 240 },
    { nivel: "Intermediário", valencia: "Hipertrofia", series: 4, repeticoes: 12, intervalo: 90, volume: "Alto", nExercicios: 6, tempo: "75-90", VT: 24, VTT: 288 },

    { nivel: "Intermediário", valencia: "Resistência", series: 3, repeticoes: 20, intervalo: 40, volume: "Baixo", nExercicios: 5, tempo: "35-50", VT: 15, VTT: 300 },
    { nivel: "Intermediário", valencia: "Resistência", series: 3, repeticoes: 20, intervalo: 40, volume: "Médio", nExercicios: 6, tempo: "45-65", VT: 18, VTT: 360 },
    { nivel: "Intermediário", valencia: "Resistência", series: 3, repeticoes: 20, intervalo: 40, volume: "Alto", nExercicios: 7, tempo: "55-75", VT: 21, VTT: 420 },

    // Avançado
    { nivel: "Avançado", valencia: "Força", series: 5, repeticoes: 6, intervalo: 120, volume: "Baixo", nExercicios: 4, tempo: "60-75", VT: 20, VTT: 120 },
    { nivel: "Avançado", valencia: "Força", series: 5, repeticoes: 6, intervalo: 120, volume: "Médio", nExercicios: 5, tempo: "75-90", VT: 25, VTT: 150 },
    { nivel: "Avançado", valencia: "Força", series: 5, repeticoes: 6, intervalo: 120, volume: "Alto", nExercicios: 6, tempo: "90-120", VT: 30, VTT: 180 },

    { nivel: "Avançado", valencia: "Hipertrofia", series: 4, repeticoes: 12, intervalo: 90, volume: "Baixo", nExercicios: 5, tempo: "60-75", VT: 20, VTT: 240 },
    { nivel: "Avançado", valencia: "Hipertrofia", series: 4, repeticoes: 12, intervalo: 90, volume: "Médio", nExercicios: 6, tempo: "75-90", VT: 24, VTT: 288 },
    { nivel: "Avançado", valencia: "Hipertrofia", series: 4, repeticoes: 12, intervalo: 90, volume: "Alto", nExercicios: 7, tempo: "90-120", VT: 28, VTT: 336 },

    { nivel: "Avançado", valencia: "Resistência", series: 3, repeticoes: 20, intervalo: 40, volume: "Baixo", nExercicios: 6, tempo: "45-65", VT: 18, VTT: 360 },
    { nivel: "Avançado", valencia: "Resistência", series: 3, repeticoes: 20, intervalo: 40, volume: "Médio", nExercicios: 7, tempo: "55-75", VT: 21, VTT: 420 },
    { nivel: "Avançado", valencia: "Resistência", series: 3, repeticoes: 20, intervalo: 40, volume: "Alto", nExercicios: 8, tempo: "65-85", VT: 24, VTT: 480 },
  ];

  return tabelaTreino.find(
    (t) => t.nivel.toLowerCase() === nivel.toLowerCase() && t.valencia.toLowerCase() === valencia.toLowerCase() && t.volume.toLowerCase() === volume.toLowerCase()
  );
}

module.exports = {
  removeStringVazia,
  formatarCelular,
  calcularIdadeDtAvaliacao,
  calcularIdade,
  getReferenceWorkout,
};
