import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class ContractsRepository {
   async createOrUpdateContract(data: any, services: any[]) {
      let contract = (await db.tab_aluno_contrato.upsert(data))[0] as any;
      for (const service of services) {
         await db.tab_aluno_contrato_modalidade.upsert({ cod_aluno_contrato: contract.cod_aluno_contrato, ...service });
      }
      return contract;
   }

   async findAll(companyId: string, studentId?: string) {
      let where = { cod_empresa: companyId } as any;
      if (studentId) where.cod_aluno = Number(studentId);
      return await db.tab_aluno_contrato.findAll({
         where: where,
         include: [
            {
               model: db.tab_aluno_contrato_modalidade,
               as: "modalidades",
               include: [
                  { model: db.tab_modalidade_variacao, as: "variacao" },
                  {
                     model: db.tab_modalidade_variacao_valor,
                     as: "variacaoValor",
                  },
                  { model: db.tab_modalidade, as: "modalidade" },
               ],
            },
            {
               model: db.tab_aluno_contrato_pagamento,
               as: "pagamentos",
               separate: true,
               order: [["expiracao_aluno_contrato_pagamento", "ASC"]],
            },
            {
               model: db.tab_aluno,
               as: "aluno",
            },
         ],
      });
   }

   async findById(contractId: string) {
      return await db.tab_aluno_contrato.findOne({
         where: { cod_aluno_contrato: contractId },
         include: [
            {
               model: db.tab_aluno_contrato_modalidade,
               as: "modalidades",
               include: [
                  { model: db.tab_modalidade_variacao, as: "variacao" },
                  {
                     model: db.tab_modalidade_variacao_valor,
                     as: "variacaoValor",
                  },
                  { model: db.tab_modalidade, as: "modalidade" },
               ],
            },
            {
               model: db.tab_aluno_contrato_pagamento,
               as: "pagamentos",
            },
            {
               model: db.tab_aluno,
               as: "aluno",
            },
         ],
      });
   }

   async updateApiId(contractId: string, apiId: string | null) {
      return await db.tab_aluno_contrato.update({ asaas_id: apiId }, { where: { cod_aluno: contractId } });
   }

   async updateContractApi(contractId: string, apiId: string | null) {
      return await db.tab_aluno_contrato.update(
         { autentique_aluno_contrato: apiId },
         { where: { cod_aluno_contrato: contractId } }
      );
   }

   async deleteById(id: string) {
      return await db.tab_aluno_contrato.destroy({ where: { cod_aluno_contrato: id } });
   }

   async cancelById(id: string) {
      return await db.tab_aluno_contrato.update(
         { status_aluno_contrato: "Canceled" },
         { where: { cod_aluno_contrato: id } }
      );
   }
}
