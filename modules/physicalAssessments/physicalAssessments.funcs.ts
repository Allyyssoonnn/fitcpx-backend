// assessment.service.ts

import { HttpException } from "@nestjs/common";
import { Request } from "express";

// ===================================================================
// 1. STUBS E TIPOS
// (Modelos do DB e helpers externos)
// ===================================================================

const { tab_aluno, tab_avaliacao, tab_avaliacao_imagem, tab_usuario } = require("../../database/models");

// STUB: Função auxiliar (use sua implementação real)
/**
 * Retorna a idade do aluno na data da avaliação.
 */
function getAgeFromPhysicalAssessmentDate(dataNascimento: string | Date, dataAvaliacao: string | Date): number {
   // Implementação de exemplo - substitua pela sua lógica real
   const start = new Date(dataNascimento);
   const end = new Date(dataAvaliacao);
   let age = end.getFullYear() - start.getFullYear();
   const m = end.getMonth() - start.getMonth();
   if (m < 0 || (m === 0 && end.getDate() < start.getDate())) {
      age--;
   }
   return age;
}

// Interfaces TypeScript para tipagem
interface IAluno {
   cod_aluno: number;
   nome_aluno: string;
   data_nascimento_aluno: string | Date;
   sexo_aluno: "M" | "F";
   etnia_aluno: "Negro" | "Caucasiano" | "Asiático" | string; // Permitindo outras strings
}

interface IAvaliacao {
   gordura_viceral?: number;
   bioimpedancia_gordura?: number;
   bioimpedancia_muscular?: number;
   bioimpedancia_idade?: number;

   cod_avaliacao: number;
   cod_aluno: number;
   cod_protocolo: number;
   data_avaliacao: string | Date;
   peso: number;
   altura: number;

   // Perimêtros
   antebraco_direito?: number;
   crista_iliaca?: number;

   // Dobras
   supra_iliaca?: number;
   peitoral?: number;
   coxa?: number;
   abdomen?: number;
   quadril?: number;
   subescapular?: number;
   triciptal?: number;
   axilar_media?: number;
   abdominal?: number;
   panturrilha?: number;

   // Circunferências
   braco_relaxado_direito?: number;
   coxa_direita?: number;
   panturrilha_direita?: number;

   // Diâmetros
   biestiloide_punho?: number;
   biepicondilo_femoral?: number;

   // Relações (para tipagem da função principal)
   usuario?: any;
   aluno?: IAluno;
   imagem?: any;
}

// Tipos para os resultados
interface ICompositionPercentage {
   gordura: number | null;
   massa_magra: number | null;
   massa_muscular: number | null;
   massa_ossea: number | null;
   massa_residual: number | null;
   mcm: number | null;
}

interface ICompositionWeight {
   gordura: number | null;
   massa_magra: number | null;
   massa_muscular: number | null;
   massa_ossea: number | null;
   massa_residual: number | null;
   mcm: number | null;
}

interface ILeanFatAreaItem {
   nome: string;
   campo: string;
   valor: string;
   prefix?: string;
}

interface ILeanAndFatArea {
   braco: ILeanFatAreaItem[];
   coxa: ILeanFatAreaItem[];
   panturrilha: ILeanFatAreaItem[];
}

interface IAssessmentResult extends IAvaliacao {
   basal: number;
   sexo: "M" | "F";
   idade: number;
   compositionPercentage: ICompositionPercentage;
   compositionWeight: ICompositionWeight;
   leanAndFatArea: ILeanAndFatArea;
   gordura: number | null;
   images: any;
}

// ===================================================================
// 2. FUNÇÕES AUXILIARES PURAS
// ===================================================================

/**
 * Arredonda um número para uma determinada precisão de casas decimais.
 */
function round(value: number, precision: number = 1): number {
   const multiplier = Math.pow(10, precision);
   return Math.round(value * multiplier) / multiplier;
}

/**
 * Calcula o Índice de Massa Corporal (IMC).
 */
function getIMC(peso: number, altura: number): number {
   if (altura === 0) return 0;
   return peso / (altura * altura);
}

/**
 * Equação de Siri para calcular %G a partir da densidade.
 */
function formulaGordura_Siri(densidade: number): number {
   if (densidade === 0) return 0;
   return 495 / densidade - 450;
}

// ===================================================================
// 3. CÁLCULO DE DENSIDADE (Protocolo-Específico)
// ===================================================================

/**
 * Protocolo 2: 18-55 anos - Jackson, Pollock e Ward - (1980)
 */
function calculaDensidade_Jackson_Pollock_Ward_2(avaliacao: IAvaliacao, idade: number): number {
   const somaCampos =
      Number(avaliacao.subescapular) +
      Number(avaliacao.triciptal) +
      Number(avaliacao.peitoral) +
      Number(avaliacao.axilar_media) +
      Number(avaliacao.supra_iliaca) +
      Number(avaliacao.abdominal) +
      Number(avaliacao.coxa);

   return 1.097 - 0.00046971 * somaCampos + 0.00000056 * somaCampos ** 2 - 0.00012828 * Number(idade);
}

/**
 * Protocolo 4: 18-61 anos - Jackson e Pollock - (1978)
 */
function calculaDensidade_JacksonPollock_4(avaliacao: IAvaliacao, idade: number): number {
   const soma =
      Number(avaliacao.peitoral) +
      Number(avaliacao.axilar_media) +
      Number(avaliacao.triciptal) +
      Number(avaliacao.subescapular) +
      Number(avaliacao.abdominal) +
      Number(avaliacao.supra_iliaca) +
      Number(avaliacao.coxa);

   return 1.112 - 0.00043499 * soma + 0.00000055 * Math.pow(soma, 2) - 0.00028826 * idade;
}

/**
 * Master: Distribui o cálculo de densidade para o protocolo correto.
 */
function calculaDensidade(aluno: IAluno, avaliacao: IAvaliacao): number {
   const idade = getAgeFromPhysicalAssessmentDate(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);
   let densidade: number = 0;

   switch (avaliacao.cod_protocolo) {
      case 2:
         densidade = calculaDensidade_Jackson_Pollock_Ward_2(avaliacao, idade);
         break;
      case 4:
         densidade = calculaDensidade_JacksonPollock_4(avaliacao, idade);
         break;

      // --- NOVO CÓDIGO AQUI ---
      case 6: // Substitua '6' pelo ID correto do protocolo Katch & McArdle no seu banco de dados
         densidade = calculaDensidade_KatchMcArdle(avaliacao);
         break;
      // ------------------------

      default:
         // Protocolos 3, 5 e Default não usam densidade,
         // mas retornamos 0 para evitar erros (embora não deva ser chamado)
         densidade = 0;
   }

   return densidade;
}

/**
 * Protocolo: Katch & McArdle (1973)
 * Público: Jovens (Masculino e Feminino)
 * Tipo: Circunferências
 */
function calculaDensidade_KatchMcArdle(avaliacao: IAvaliacao): number {
   // Mapeamento dos campos de Perímetro/Circunferência
   // Nota: Usamos 'braco_relaxado_direito' e 'panturrilha_direita' pois são as circunferências,
   // e 'abdomen' seguindo o padrão usado no protocolo Tran & Weltman (Protocolo 5).

   const pBraco = Number(avaliacao.braco_relaxado_direito);
   const pAbdomen = Number(avaliacao.abdomen);
   const pPanturrilha = Number(avaliacao.panturrilha_direita);

   // Fórmula: D = 1,12691 – 0,00357 * P. BRAÇO – 0,00127 * P. ABDOMEN + 0,00524 * P. PANTURRILHA
   const densidade = 1.12691 - 0.00357 * pBraco - 0.00127 * pAbdomen + 0.00524 * pPanturrilha;

   return densidade;
}

// ===================================================================
// 4. CÁLCULO DE % GORDURA (Protocolo-Específico)
// ===================================================================

/**
 * Protocolo 3: 50-75 anos - Rech, Santos e Silva - (2006)
 */
function protocoloGordura_RechSantosSilva_3(avaliacao: IAvaliacao, idade: number): number {
   const soma = Number(avaliacao.supra_iliaca) + Number(avaliacao.peitoral) + Number(avaliacao.coxa);
   const primeiroTermo = 0.368352 * soma;
   const segundoTermo = 0.001153 * Math.pow(soma, 2);
   const terceiroTermo = 0.153198 * idade;
   return 10.927073 + primeiroTermo - segundoTermo + terceiroTermo;
}

/**
 * Protocolo 5: 60-81 anos - Tran e Weltman - (1988)
 */
function protocoloGordura_TranWeltman_5(avaliacao: IAvaliacao): number {
   // function calculaIliaco(avaliacao: IAvaliacao) {
   //    return (Number(avaliacao.abdomen) + Number(avaliacao.quadril)) / 2;
   // }

   const resultado =
      -47.371817 +
      0.57914807 * Number(avaliacao.abdomen) +
      0.25189114 * Number(avaliacao.quadril) +
      // 0.21366088 * Number(calculaIliaco(avaliacao)) -
      0.21366088 * Number(avaliacao.crista_iliaca) -
      0.35595404 * Number(avaliacao.peso);

   return resultado;
}

/**
 * Protocolo Padrão: 7-17 anos - Dezenberg, Weststrate, Seidell - (1991)
 */
function protocoloGordura_Dezenberg_Default(aluno: IAluno, imc: number, idade: number): number {
   const fator = aluno.sexo_aluno === "M" ? 1 : 2;
   const primeiroTermo = 1.5 * imc;
   const segundoTermo = 0.7 * idade;
   const terceiroTermo = 3.6 * fator;
   return primeiroTermo - segundoTermo - terceiroTermo + 1.4;
}

/**
 * Master: Calcula o percentual de gordura distribuindo para o protocolo correto.
 */
export function calculaPorcentagemGordura(aluno: IAluno, avaliacao: IAvaliacao): number {
   const idade = getAgeFromPhysicalAssessmentDate(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);
   let resultado: number;

   switch (avaliacao.cod_protocolo) {
      case 7: // Bioimpedância
         resultado = Number(avaliacao.bioimpedancia_gordura) || 0;
         break;

      // Protocolos 2 e 4 usam Densidade (Siri)
      case 2:
      case 4:
      case 6:
         const densidade = calculaDensidade(aluno, avaliacao); // Já é formatado .toFixed(3)
         resultado = formulaGordura_Siri(Number(densidade));
         break;

      // Protocolo 3 (Rech)
      case 3:
         resultado = protocoloGordura_RechSantosSilva_3(avaliacao, idade);
         break;

      // Protocolo 5 (Tran)
      case 5:
         resultado = protocoloGordura_TranWeltman_5(avaliacao);
         break;

      // Protocolo Padrão (Dezenberg)
      default:
         const imc = getIMC(avaliacao.peso, avaliacao.altura);
         resultado = protocoloGordura_Dezenberg_Default(aluno, imc, idade);
         break;
   }

   return round(resultado, 1);
}

// ===================================================================
// 5. CÁLCULO DOS COMPONENTES CORPORAIS
// ===================================================================

// --- Gordura (KG) ---
function calculaKGGordura(peso: number, porcentagemGordura: number): number {
   return round((peso * porcentagemGordura) / 100, 1);
}

// --- Massa Magra ---
export function calculaKGMassaMagra(peso: number, kgGordura: number): number {
   return round(peso - kgGordura, 1);
}

export function calculaPorcentagemMassaMagra(peso: number, kgMassaMagra: number): number {
   if (peso === 0) return 0;
   return round((kgMassaMagra / peso) * 100, 1);
}

// --- Massa Muscular ---
export function calculaKGMusculo(aluno: IAluno, avaliacao: IAvaliacao): number {
   const idade = getAgeFromPhysicalAssessmentDate(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);

   const p_braco = Number(avaliacao.braco_relaxado_direito) - Math.PI * (Number(avaliacao.triciptal) / 10);
   const p_coxa = Number(avaliacao.coxa_direita) - Math.PI * (Number(avaliacao.coxa) / 10);
   const p_panturrilha = Number(avaliacao.panturrilha_direita) - Math.PI * (Number(avaliacao.panturrilha) / 10);

   const fatorSexo = aluno.sexo_aluno === "M" ? 1 : 0;

   const fatorEtnia =
      aluno.etnia_aluno === "Negro"
         ? 1.1
         : aluno.etnia_aluno === "Caucasiano"
         ? 0
         : aluno.etnia_aluno === "Asiático"
         ? -2
         : 0;

   const result =
      avaliacao.altura * // O (altura * 100) / 100 original é apenas altura
         (0.00744 * Math.pow(p_braco, 2) + 0.00088 * Math.pow(p_coxa, 2) + 0.00441 * Math.pow(p_panturrilha, 2)) +
      2.4 * fatorSexo -
      0.048 * idade +
      fatorEtnia +
      7.8;

   return round(result, 1);
}

export function calculaPorcentagemMusculo(peso: number, kgMusculo: number): number {
   if (peso === 0) return 0;
   // O cálculo original (((kgMusculo / peso) * 1000) / 10) é matematicamente
   // idêntico a (kgMusculo / peso) * 100
   return round((kgMusculo / peso) * 100, 1);
}

// --- Massa Óssea ---
function calculaKGOsseo(avaliacao: IAvaliacao): number {
   const altura_m = avaliacao.altura; // Já está em metros
   const punho_m = Number(avaliacao.biestiloide_punho) / 100;
   const femoral_m = Number(avaliacao.biepicondilo_femoral) / 100;

   const termoInterno = Math.pow(altura_m, 2) * punho_m * femoral_m * 400;

   const result = 3.02 * Math.pow(termoInterno, 0.712);
   return round(result, 1);
}

function calculaPorcentagemOsseo(peso: number, kgOsseo: number): number {
   if (peso === 0) return 0;
   // (kgOsseo / peso) * 100
   return round((kgOsseo / peso) * 100, 1);
}

// --- Massa Residual ---
function calculaKGResidual(peso: number, kgGordura: number, kgMusculo: number, kgOsseo: number): number {
   const residual = peso - kgGordura - kgMusculo - kgOsseo;
   // O original usava Math.floor(residual * 10) / 10,
   // que é um arredondamento para baixo. Preservando:
   return Math.floor(residual * 10) / 10;
}

function calculaPorcentagemResidual(peso: number, kgResidual: number): number {
   if (peso === 0) return 0;
   const porcentagem = (kgResidual / peso) * 100;
   // O original ((porcentagem * 10) / 10) é redundante,
   // mas preservamos o arredondamento final.
   return round(porcentagem, 1);
}

// --- MCM (Massa Corporal Magra) ---
// Nota: Esta fórmula é idêntica a calculaKGMassaMagra
function calculaKGMCM(peso: number, kgGordura: number): number {
   return round(peso - kgGordura, 1);
}

function calculaPorcentagemMCM(peso: number, kgMcm: number): number {
   if (peso === 0) return 0;
   return round((kgMcm / peso) * 100, 1);
}

// --- Metabolismo Basal ---
/**
 * Calcula o metabolismo basal (Fórmula de Cunningham).
 */
function getBasal(kgMassaMagra: number): number {
   // Fórmula: 370 + 21,6 * Massa Magra (kg)
   return round(370 + 21.6 * kgMassaMagra, 2);
}

// --- Áreas Magra e Gorda ---
/**
 * Helper interno para calcular áreas de um membro.
 */
function _calculaAreaMembro(circunferencia: number, dobra: number): any {
   // Preservando a lógica original 1:1, incluindo verificações de null/undefined
   const circunferenciaVal = Number(circunferencia) || 0;
   const dobraVal = Number(dobra) || 0;
   const dobra_cm = dobraVal / 10;

   const a_total = Math.pow(circunferenciaVal, 2) / (4 * Math.PI);

   const p_corrigido = circunferenciaVal ? circunferenciaVal - Math.PI * dobra_cm : 0;

   // ATENÇÃO: Preservando a fórmula original de 'a_magra', conforme solicitado,
   // embora ela pareça matematicamente incomum.
   const a_magra = a_total && dobraVal ? a_total - (Math.pow(Math.PI * dobra_cm, 2) / 4) * Math.PI : 0;

   const a_gorda = a_total && a_magra ? a_total - a_magra : 0;

   const per_a_magra = a_magra && a_total ? (a_magra / a_total) * 100 : 0;
   const per_a_gorda = a_gorda && a_total ? (a_gorda / a_total) * 100 : 0;

   return {
      a_total: round(a_total, 2),
      p_corrigido: round(p_corrigido, 2),
      a_magra: round(a_magra, 2),
      a_gorda: round(a_gorda, 1),
      per_a_magra: round(per_a_magra, 0),
      per_a_gorda: round(per_a_gorda, 0),
   };
}

function getAreaMagraGorda(avaliacao: IAvaliacao): ILeanAndFatArea {
   const braco = _calculaAreaMembro(avaliacao.braco_relaxado_direito ?? 0, avaliacao.triciptal ?? 0);
   const coxa = _calculaAreaMembro(avaliacao.coxa_direita ?? 0, avaliacao.coxa ?? 0);
   const panturrilha = _calculaAreaMembro(avaliacao.panturrilha_direita ?? 0, avaliacao.panturrilha ?? 0);

   return {
      braco: [
         { nome: "A. Total (cm²)", campo: "a_total_braco", valor: braco.a_total.toFixed(2) },
         { nome: "P. Braço (cm)", campo: "p_braco", valor: braco.p_corrigido.toFixed(2) },
         { nome: "A. Magra (cm²)", campo: "a_magra", valor: braco.a_magra.toFixed(2) },
         { nome: "A. Magra (%)", campo: "a_magra", valor: braco.per_a_magra.toFixed(0), prefix: "%" },
         { nome: "A. Gorda (cm²)", campo: "a_gorda", valor: braco.a_gorda.toFixed(1) },
         { nome: "A. Gorda (%)", campo: "a_gorda", valor: braco.per_a_gorda.toFixed(0), prefix: "%" },
      ],
      coxa: [
         { nome: "A. Total (cm²)", campo: "a_total_coxa", valor: coxa.a_total.toFixed(2) },
         { nome: "P. Coxa (cm)", campo: "p_coxa", valor: coxa.p_corrigido.toFixed(2) },
         { nome: "A. Magra (cm²)", campo: "a_magra_coxa", valor: coxa.a_magra.toFixed(2) },
         { nome: "A. Magra (%)", campo: "a_magra_coxa", valor: coxa.per_a_magra.toFixed(0), prefix: "%" },
         { nome: "A. Gorda (cm²)", campo: "a_gorda_coxa", valor: coxa.a_gorda.toFixed(1) },
         { nome: "A. Gorda (%)", campo: "a_gorda", valor: coxa.per_a_gorda.toFixed(0), prefix: "%" },
      ],
      panturrilha: [
         { nome: "A. Total (cm²)", campo: "a_total_panturrilha", valor: panturrilha.a_total.toFixed(2) },
         { nome: "P. Panturrilha (cm)", campo: "p_panturrilha", valor: panturrilha.p_corrigido.toFixed(2) },
         { nome: "A. Magra (cm²)", campo: "a_magra_panturrilha", valor: panturrilha.a_magra.toFixed(2) },
         { nome: "A. Magra (%)", campo: "a_magra_panturrilha", valor: panturrilha.per_a_magra.toFixed(0), prefix: "%" },
         { nome: "A. Gorda (cm²)", campo: "a_gorda_panturrilha", valor: panturrilha.a_gorda.toFixed(1) },
         { nome: "A. Gorda (%)", campo: "a_gorda", valor: panturrilha.per_a_gorda.toFixed(0), prefix: "%" },
      ],
   };
}

// ===================================================================
// 6. FUNÇÕES ORQUESTRADORAS (Exportadas)
// ===================================================================

/**
 * Função principal que orquestra todos os cálculos da avaliação física.
 */
export async function getResultPhysicalFunc(aluno: IAluno, avaliacao: IAvaliacao): Promise<IAssessmentResult> {
   // Cálculos Sequenciais
   const pctGordura = calculaPorcentagemGordura(aluno, avaliacao);
   const kgGordura = calculaKGGordura(avaliacao.peso, pctGordura);

   const kgMassaMagra = calculaKGMassaMagra(avaliacao.peso, kgGordura);
   const pctMassaMagra = calculaPorcentagemMassaMagra(avaliacao.peso, kgMassaMagra);

   // 3. Massa Muscular (Lógica condicional)
   let kgMusculo: number;
   let pctMusculo: number;

   if (avaliacao.cod_protocolo === 7) {
      // Se for Bioimpedância, usa o valor informado
      pctMusculo = Number(avaliacao.bioimpedancia_muscular) || 0;
      kgMusculo = round((avaliacao.peso * pctMusculo) / 100, 1);
   } else {
      // Se for dobras, usa a fórmula antropométrica existente
      kgMusculo = calculaKGMusculo(aluno, avaliacao);
      pctMusculo = calculaPorcentagemMusculo(avaliacao.peso, kgMusculo);
   }

   const kgOsseo = avaliacao.biestiloide_punho && avaliacao.biepicondilo_femoral ? calculaKGOsseo(avaliacao) : 0;
   const pctOsseo = calculaPorcentagemOsseo(avaliacao.peso, kgOsseo);

   const kgResidual = calculaKGResidual(avaliacao.peso, kgGordura, kgMusculo, kgOsseo);
   const pctResidual = calculaPorcentagemResidual(avaliacao.peso, kgResidual);

   const kgMcm = calculaKGMCM(avaliacao.peso, kgGordura);
   const pctMcm = calculaPorcentagemMCM(avaliacao.peso, kgMcm);

   const leanAndFatArea = getAreaMagraGorda(avaliacao);

   const basal = getBasal(kgMassaMagra);

   const idade = getAgeFromPhysicalAssessmentDate(aluno.data_nascimento_aluno, avaliacao.data_avaliacao);

   // Montagem do Objeto de Resultado
   const result: IAssessmentResult = {
      ...avaliacao,
      basal,
      sexo: aluno.sexo_aluno,
      idade,
      compositionPercentage: {
         gordura: pctGordura,
         massa_magra: pctMassaMagra,
         massa_muscular: pctMusculo,
         massa_ossea: pctOsseo,
         massa_residual: pctResidual,
         mcm: pctMcm,
      },
      compositionWeight: {
         gordura: kgGordura,
         massa_magra: kgMassaMagra,
         massa_muscular: kgMusculo,
         massa_ossea: kgOsseo,
         massa_residual: kgResidual,
         mcm: kgMcm,
      },
      leanAndFatArea,
      gordura: pctGordura,
      images: avaliacao.imagem,
   };

   return result;
}

/**
 * Handler da Rota: Busca dados no DB e chama a função de cálculo.
 */
export async function getResultPhysicalAssesment(req: Request) {
   try {
      const { avaliacao: avaliacaoReq, cod_avaliacao, cod_aluno } = req.body;

      const avaliacaoDb = await tab_avaliacao.findOne({
         include: [
            { model: tab_usuario, as: "usuario", required: false },
            { model: tab_aluno, as: "aluno", required: true, attributes: ["nome_aluno"] },
            { model: tab_avaliacao_imagem, as: "imagem" },
         ],
         where: {
            cod_avaliacao: cod_avaliacao ?? avaliacaoReq.cod_avaliacao,
         },
      });

      if (!avaliacaoDb) {
         throw new HttpException("Avaliação não encontrada.", 403);
      }

      const alunoDb = await tab_aluno.findOne({
         where: { cod_aluno: cod_aluno ?? avaliacaoDb?.cod_aluno },
      });

      if (!alunoDb) {
         throw new HttpException("Aluno não encontrado.", 403);
      }

      // Converte os modelos do Sequelize para objetos planos
      const avaliacaoPlain: IAvaliacao = avaliacaoDb.get ? avaliacaoDb.get({ plain: true }) : avaliacaoDb;
      const alunoPlain: IAluno = alunoDb.get ? alunoDb.get({ plain: true }) : alunoDb;

      // A avaliação plana pode não ter o aluno aninhado, então garantimos que a
      // função principal receba as duas entidades separadas e completas.
      // A `avaliacaoPlain` já contém a relação `aluno`, mas `alunoPlain` é mais completo.
      // A função `getResultPhysicalFunc` espera o aluno como primeiro argumento.
      const result = await getResultPhysicalFunc(alunoPlain, avaliacaoPlain);

      return result;
   } catch (error: any) {
      console.error("Error in getResultPhysicalAssesment:", error);
      throw new HttpException(error.message, 403);
   }
}
