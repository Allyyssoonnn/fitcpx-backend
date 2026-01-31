import moment from "moment-timezone";

export function getNextPayoutDate(date?: Date) {
   const now = moment(date); // Usa data atual se undefined
   const day = now.date();

   // Se hoje é antes do dia 10, retorna dia 10 deste mês
   if (day < 10) return now.date(10).toDate();

   // Se hoje é entre 10 e 19, retorna dia 20 deste mês
   if (day < 20) return now.date(20).toDate();

   // Se hoje é entre 20 e 29...
   if (day < 30) {
      // Cuidado com Fevereiro: se hoje é 25/02, o próximo '30' não existe.
      // Regra de negócio: O pagamento é no fim do mês ou pula pro dia 10?
      // Assumindo que dia 30 = Fim do mês:
      const endOfMonth = now.daysInMonth();
      if (endOfMonth < 30) {
         return now.endOf("month").toDate(); // Retorna 28/29 Fev
      }
      return now.date(30).toDate();
   }

   // Se já passou do dia 30 (ou é dia 30), próximo é dia 10 do mês seguinte
   return now.add(1, "month").date(10).toDate();
}

export function getStartDateFromPayout(payoutDate: Date) {
   // Clona a data para não alterar a original e facilita a manipulação
   const current = moment(payoutDate);
   const day = current.date();

   // Caso 1: Pagamento dia 20 -> Início é dia 10 do mesmo mês
   if (day === 20) {
      return current.date(10).toDate();
   }

   // Caso 2: Pagamento dia 30 -> Início é dia 20 do mesmo mês
   if (day === 30) {
      return current.date(20).toDate();
   }

   // Caso 3: Pagamento dia 10 -> Início é dia 30 do MÊS ANTERIOR
   if (day === 10) {
      // Volta 1 mês
      const prevMonth = current.subtract(1, "month");

      // Tenta setar dia 30.
      // O Moment é inteligente: se for Fevereiro e não tiver dia 30,
      // precisamos travar no final do mês para não pular para Março.
      const daysInPrevMonth = prevMonth.daysInMonth();

      if (daysInPrevMonth < 30) {
         return prevMonth.endOf("month").toDate(); // Retorna 28 ou 29 de Fev
      }

      return prevMonth.date(30).toDate();
   }

   // Fallback de segurança se a data passada não for 10, 20 ou 30
   return moment(payoutDate).subtract(10, "days").toDate();
}

export const formatarCPF = (cpf: string) => {
   if (!cpf) return "-";
   cpf = cpf.replace(/\D/g, ""); // Remove tudo que não for dígito
   if (cpf.length !== 11) return cpf; // Se não tiver 11 dígitos, retorna como está
   return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatarCNPJ = (cnpj: string) => {
   if (!cnpj) return "-";
   cnpj = cnpj.replace(/\D/g, ""); // Remove tudo que não for dígito
   if (cnpj.length !== 14) return cnpj; // Se não tiver 14 dígitos, retorna como está
   return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export const formatarCEP = (cep: string) => {
   if (!cep) return "-";
   const digits = cep.replace(/\D/g, ""); // Remove tudo que não for dígito
   if (digits.length !== 8) return digits; // CEP tem sempre 8 dígitos
   return digits.replace(/^(\d{5})(\d{3})$/, "$1-$2");
};

export const adicionarMesData = (data: any, mesesAdicionais = 0) => {
   if (!data) return "";

   let date;

   if (typeof data === "string") {
      // Caso seja uma string no formato YYYY-MM-DD
      const [year, month, day] = data.split("-");
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
   } else if (data instanceof Date) {
      // Caso já seja um objeto Date
      date = new Date(data);
   } else if (typeof data === "number") {
      // Caso seja um timestamp
      date = new Date(data);
   } else {
      return "";
   }

   // Adiciona os meses, se houver
   if (mesesAdicionais !== 0) {
      date.setMonth(date.getMonth() + mesesAdicionais);
   }

   return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
   });
};
