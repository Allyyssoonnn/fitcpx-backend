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
