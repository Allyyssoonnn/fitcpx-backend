export function replaceVariables(template: string, variables: any) {
   let result = template;
   for (const key in variables) {
      result = result.replace(`{${key}}`, variables[key]);
   }
   return result;
}

export const paymentOverdue = `> *Fatura vencida*

Olá, *{name}! Tudo bem? 👋*
_Identificamos uma fatura ainda em aberto, segue a fatura abaixo:_

📄 _Contrato:_ *{description}*
🗓 _Data:_ *{date}*
💲 _Valor:_ *{value}*

🔗 _Link da fatura:_
{url}

_Dúvidas? Entre em contato com a empresa contratada:_
{support}

${"`Ignore esta mensagem caso já tenha realizado o pagamento.`"}`;

export const sentPayout = `> *Repasse enviado*

Olá, *{name}! Tudo bem? 👋*
_Seu repasse foi enviado com sucesso!_

🗓 _Período:_ *{startDate} à {endDate}*
💲 _Valor:_ *{value}*

_Dúvidas? Entre em contato com nosso suporte:_
https://wa.me/551152866458

${"`Comprovante de transação em anexo.`"}`;
