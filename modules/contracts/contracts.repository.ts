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
}
