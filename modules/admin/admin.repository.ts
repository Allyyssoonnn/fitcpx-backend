import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import db from "../../database/models";

@Injectable()
export class AdminRepository {
   async findLicensePayments(companyId: string, startDate: string, endDate: string) {
      return db.tab_aluno_contrato_pagamento.findAll({
         include: [
            {
               model: db.tab_aluno_contrato,
               as: "contract",
               where: { cod_empresa: companyId },
               include: [
                  {
                     model: db.tab_aluno,
                     as: "aluno",
                  },
               ],
            },
         ],
         where: {
            repasse_aluno_contrato_pagamento: {
               [Op.between]: [startDate, endDate],
            },
         },
      });
   }
}
