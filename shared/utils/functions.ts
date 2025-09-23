export function getAgeFromPhysicalAssessmentDate(dataNascimento: string, dataAvaliacao: string) {
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
