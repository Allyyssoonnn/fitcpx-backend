import moment from "moment-timezone";
import { adicionarMesData, formatarCEP, formatarCNPJ, formatarCPF } from "../../utils/global";
import { convertNumberToTextWithDecimals } from "./convertNumberToText";

const getDoc = (doc: string) => {
   if (!doc) return "";
   if (doc.length == 11) return formatarCPF(doc);
   if (doc.length == 14) return formatarCNPJ(doc);
   return doc;
};

export function preencherContrato(
   contrato: string,
   aluno: any,
   empresa: any,
   modalidades: any[],
   plano: any,
   dataInicio = new Date(),
) {
   // Função para decodificar entidades HTML (como &lt; e &gt;)
   function decodeHtml(html: string) {
      const entities: { [key: string]: string } = {
         "&amp;": "&",
         "&lt;": "<",
         "&gt;": ">",
         "&quot;": '"',
         "&#039;": "'",
         "&nbsp;": " ",
      };
      // Substitui as entidades encontradas pelo caractere correspondente
      return html.replace(/&amp;|&lt;|&gt;|&quot;|&#039;|&nbsp;/g, (match) => entities[match]);
   }

   const parcelas = plano?.parcela_plano ? JSON.parse(plano?.parcela_plano) : [];

   // Formatação da lista de mensalidades
   const descMensalidades = parcelas
      .map(
         (parcela: string, i: number) =>
            `<p style="margin-left: 20px;">${i + 1}. ${convertNumberToTextWithDecimals(Number(parcela))} pagável até o dia ${adicionarMesData(dataInicio, i)}</p>`,
      )
      .join("");

   const desc = modalidades && modalidades.length > 0 ? modalidades.map((m) => m.nome_modalidade).join(", ") : "";

   let preenchido = decodeHtml(contrato);

   // --- Substituição usando .replace() com Regex Global (/g) ---
   // Nota: Quando se usa regex com /g, o .replace substitui TODAS as ocorrências, igual ao replaceAll

   preenchido = preenchido.replace(/background: aqua/g, "");

   // Datas
   preenchido = preenchido.replace(/<data_de_inicio>/g, moment(dataInicio).format("DD/MM/YYYY") || "Não definido");
   preenchido = preenchido.replace(
      /<data_de_termino>/g,
      moment(dataInicio)
         .add(plano?.duracao_plano || 1, "M")
         .format("DD/MM/YYYY") || "Não definido",
   );
   preenchido = preenchido.replace(/<data_vencimento>/g, moment(dataInicio).format("DD") || "Não definido");
   preenchido = preenchido.replace(/<tempo_contrato>/g, String(plano?.duracao_plano || "Não definido")); // Forçar string

   // Valores Monetários
   preenchido = preenchido.replace(
      /<valor_total_plano>/g,
      plano?.valor_plano ? convertNumberToTextWithDecimals(plano.valor_plano, "pt") : "Não definido",
   );
   preenchido = preenchido.replace(
      /<valor_mensal_unitario>/g,
      parcelas[0] ? convertNumberToTextWithDecimals(parcelas[0], "pt") : "Não definido",
   );

   // Juros e Multas
   preenchido = preenchido.replace(/<multa_percentagem>/g, plano?.multa_moratoria ? `${plano.multa_moratoria}%` : "0%");
   preenchido = preenchido.replace(/<juros_percentagem>/g, plano?.juros_atraso ? `${plano.juros_atraso}%` : "0%");
   preenchido = preenchido.replace(
      /<percentagem_multa>/g,
      plano?.multa_compensatoria ? `${plano.multa_compensatoria}%` : "0%",
   );

   // Variáveis do aluno
   preenchido = preenchido.replace(/<nome_aluno>/g, aluno.nome_aluno || "");
   preenchido = preenchido.replace(/<cpf_aluno>/g, aluno?.cpf_aluno ? formatarCPF(aluno.cpf_aluno) : "");
   preenchido = preenchido.replace(/<rg_aluno>/g, aluno.rg_aluno || "");
   preenchido = preenchido.replace(/<email_aluno>/g, aluno.email_aluno || "");
   preenchido = preenchido.replace(/<endereco_aluno>/g, aluno.endereco_aluno || " - ");
   preenchido = preenchido.replace(/<cidade_aluno>/g, aluno.cidade_aluno || " - ");
   preenchido = preenchido.replace(/<estado_aluno>/g, aluno.estado_aluno || " - ");
   preenchido = preenchido.replace(/<numero_aluno>/g, aluno.numero_aluno || " - ");
   preenchido = preenchido.replace(/<cep_aluno>/g, aluno?.cep_aluno ? formatarCEP(aluno?.cep_aluno) : " - ");
   preenchido = preenchido.replace(/<bairro_aluno>/g, aluno.bairro_aluno || " - ");

   // Variáveis da empresa
   preenchido = preenchido.replace(/<nome_empresa>/g, empresa.nome_empresa || "");
   preenchido = preenchido.replace(/<doc_empresa>/g, empresa?.doc_empresa ? getDoc(empresa.doc_empresa) : "");
   preenchido = preenchido.replace(/<email_empresa>/g, empresa?.email_empresa || "");
   preenchido = preenchido.replace(/<endereco_empresa>/g, empresa.endereco_empresa || " - ");
   preenchido = preenchido.replace(/<cidade_empresa>/g, empresa.cidade_empresa || " - ");
   preenchido = preenchido.replace(/<estado_empresa>/g, empresa.estado_empresa || " - ");
   preenchido = preenchido.replace(/<numero_empresa>/g, empresa.numero_empresa || " - ");
   preenchido = preenchido.replace(/<bairro_empresa>/g, empresa.bairro_empresa || " - ");
   preenchido = preenchido.replace(/<cep_empresa>/g, empresa?.cep_empresa ? formatarCEP(empresa?.cep_empresa) : "");

   // Descritivos
   preenchido = preenchido.replace(/<modalidade>/g, desc);
   preenchido = preenchido.replace(/<valor_total>/g, convertNumberToTextWithDecimals(plano?.valor_plano ?? 0));
   preenchido = preenchido.replace(/<valor_mensal>/g, descMensalidades);

   return preenchido;
}

//valorAdesao Sempre zero
export function processaPlano(plano: any, duracaoPlano: number, valorAdesao = 0) {
   if (!plano?.modalidades?.length) {
      return {
         planoAtualizado: { ...plano, modalidades: [], valor_plano: 0, parcela_plano: "[]" },
         valorTotal: 0,
      };
   }

   const modalidades = plano.modalidades.map((m: any) => {
      let valorFinal = 0;
      let nomeFinal = "";
      let nomeOriginal = "";
      nomeOriginal = m.nome_modalidade_original ?? m.nome_modalidade;

      if (m.cod_modalidade_variacao && m.variacoes) {
         const variacao = m.variacoes.find((v: any) => v.cod_modalidade_variacao === m.cod_modalidade_variacao);

         if (variacao) {
            valorFinal = variacao.valor_modalidade_variacao ?? 0;
            nomeFinal = `${nomeOriginal} - ${variacao.nome_modalidade_variacao}`;

            const sub = (variacao.valores || []).filter(
               (v: any) => duracaoPlano >= Number(v.quantidade_modalidade_variacao_valor || 0),
            );

            if (sub.length) {
               const ultima = sub[sub.length - 1];

               valorFinal = Number(ultima.valor_modalidade_variacao_valor || 0);
               if (m.valor_modalidade_alterado != null) valorFinal = m.valor_modalidade_alterado;

               return {
                  ...m,
                  cod_modalidade_variacao_valor: ultima.cod_modalidade_variacao_valor,
                  valor_modalidade: valorFinal,
                  nome_modalidade: `${nomeFinal} - ${ultima.nome_modalidade_variacao_valor}`,
                  nome_modalidade_original: nomeOriginal,
               };
            }
         }
      }

      if (m.valor_modalidade_alterado != null) valorFinal = m.valor_modalidade_alterado;

      // fallback se não houver variação/subvariação
      return {
         ...m,
         valor_modalidade: valorFinal || m.valor_modalidade_original || m.valor_modalidade || 0,
         nome_modalidade: nomeFinal ?? m.nome_modalidade_original ?? m.nome_modalidade,
         nome_modalidade_original: nomeOriginal,
      };
   });

   const totalBase = modalidades.reduce((sum: number, m: any) => sum + (m.valor_modalidade || 0), 0);
   const valorTotal = totalBase * duracaoPlano;
   const parcelas = dividirParcelas(duracaoPlano, valorTotal);

   const planoAtualizado = {
      ...plano,
      modalidades,
      //Não somar plano de adesão pois cobrança é feita separada
      valor_plano: valorTotal,
      parcela_plano: JSON.stringify(parcelas),
   };

   // return { planoAtualizado, valorTotal };
   return planoAtualizado;
}

export function dividirParcelas(qtdParcelas: number, valorTotal: number) {
   const totalCentavos = Math.round(valorTotal * 100);
   const valorBase = Math.floor(totalCentavos / qtdParcelas); // valor mínimo por parcela em centavos
   const resto = totalCentavos % qtdParcelas; // quanto sobra pra distribuir

   const parcelas = [];

   for (let i = 0; i < qtdParcelas; i++) {
      // As primeiras "resto" parcelas recebem 1 centavo a mais
      const valorParcela = i < resto ? valorBase + 1 : valorBase;
      parcelas.push(valorParcela / 100); // volta pra reais
   }

   return parcelas;
}
