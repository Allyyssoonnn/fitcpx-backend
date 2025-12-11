import { Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import { Op } from "sequelize";
import db from "../../database/models";

@Injectable()
export class AdminRepository {
   async getClient(companyId: string) {
      const companyRaw = await db.tab_empresa.findOne({
         where: { cod_empresa: companyId },
         include: [
            {
               model: db.tab_empresa_licenca,
               as: "licenses",
               include: [
                  { model: db.tab_licenca, as: "licenca" },
                  { model: db.tab_empresa_licenca_pagamento, as: "payments" },
               ],
            },
         ],
      });
      const company = companyRaw?.get({ plain: true });

      company.studentCount = await db.tab_aluno.count({ where: { cod_empresa: company.cod_empresa } });
      company.workoutCount = await db.tab_treino.count({ where: { cod_empresa: company.cod_empresa } });
      company.accessHistory = await db.tab_refreshtoken_usuario.findAll({
         limit: 20,
         include: [
            {
               model: db.tab_usuario,
               as: "usuario",
               where: { cod_empresa: company.cod_empresa },
            },
         ],
         order: [["cod_refreshtoken_usuario", "DESC"]],
      });

      return company;
   }

   async getClients() {
      const companiesRaw = await db.tab_empresa.findAll({
         include: [
            {
               model: db.tab_empresa_licenca,
               as: "licenses",
               include: [
                  { model: db.tab_licenca, as: "licenca" },
                  { model: db.tab_empresa_licenca_pagamento, as: "payments" },
               ],
            },
         ],
      });
      const companies = companiesRaw.map((c) => c.get({ plain: true }));
      for (const company of companies as any) {
         company.studentCount = await db.tab_aluno.count({ where: { cod_empresa: company.cod_empresa } });
         company.workoutCount = await db.tab_treino.count({ where: { cod_empresa: company.cod_empresa } });
      }

      return companies;
   }

   async findLicensePayments(companyId: string, startDate: string, endDate: string) {
      return db.tab_aluno_contrato_pagamento.findAll({
         include: [
            {
               paranoid: false,
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
            // data_aluno_contrato_pagamento: {
            //    [Op.between]: [startDate, endDate],
            // },
         },
      });
   }

   async getRefreshTokens(date: string) {
      const start = `${date} 00:00:00`;
      const end = `${date} 23:59:59`;
      return db.tab_refreshtoken_usuario.findAll({
         where: {
            createdAt: {
               [Op.between]: [start, end],
            },
         },
         include: [
            {
               model: db.tab_usuario,
               as: "usuario",
            },
         ],
      });
   }

   async getNewClientsDashboardByMonth(year?: number) {
      const monthsArr: string[] = [];

      const yearQuery = year ?? 2025;

      // Criar array dos últimos 12 meses (abreviação Jan, Feb...)
      for (let i = 0; i < 12; i++) {
         const d = new Date(yearQuery, i, 1);
         const month = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
         monthsArr.push(month);
      }

      // Inicializar objeto com 0
      const newsClients: Record<string, { trials: number; payments: number; noPayments: number }> = {};
      monthsArr.forEach((m) => {
         newsClients[m] = { trials: 0, payments: 0, noPayments: 0 };
      });

      // Buscar todas empresas com licenças e pagamentos
      const companies = (await db.tab_empresa.findAll({
         attributes: ["createdAt"],
         include: [
            {
               model: db.tab_empresa_licenca,
               as: "licenses",
               attributes: ["createdAt"],
               include: [
                  {
                     model: db.tab_empresa_licenca_pagamento,
                     as: "payments",
                     attributes: ["status_empresa_licenca_pagamento", "createdAt"],
                  },
               ],
            },
         ],
      })) as any[];

      companies.forEach((company) => {
         const createdAt = new Date(company.createdAt);
         const companyMonth = createdAt.toLocaleString("en-US", { month: "short" }).toLowerCase();
         const companyYear = createdAt.getFullYear();

         if (companyYear !== yearQuery) return; // ignorar se não for do ano selecionado

         const licenses = company.licenses || [];

         // 1️⃣ TRIAL → sem licença
         if (licenses.length === 0) {
            newsClients[companyMonth].trials++;
            return;
         }

         // 2️⃣ PAYMENTS → pelo menos um pagamento succeeded
         const hasSucceededPayment = licenses.some(
            (l: any) => l.payments && l.payments.some((p: any) => p.status_empresa_licenca_pagamento === "succeeded")
         );

         if (hasSucceededPayment) {
            newsClients[companyMonth].payments++;
            return;
         }

         // 3️⃣ NO PAYMENTS → tem licença, mas nenhum succeeded
         newsClients[companyMonth].noPayments++;
      });

      return newsClients;
   }

   async getClientsCount() {
      const count = { trials: 0, payers: 0, noPayers: 0, noFeedback: 0 };

      // Buscar todas empresas com licenças e pagamentos
      const companies = (await db.tab_empresa.findAll({
         attributes: ["createdAt"],
         include: [
            {
               model: db.tab_empresa_licenca,
               as: "licenses",
               attributes: ["createdAt"],
               include: [
                  {
                     model: db.tab_empresa_licenca_pagamento,
                     as: "payments",
                     attributes: ["status_empresa_licenca_pagamento", "createdAt"],
                  },
               ],
            },
         ],
      })) as any[];

      companies.forEach((company) => {
         const licenses = company.licenses || [];
         const diff = moment().diff(moment(company.createdAt), "days");
         const isStale = diff > 7;

         // 1️⃣ TRIAL → sem licença
         if (licenses.length === 0) {
            if (!company.feedback) {
               if (isStale) count.noFeedback++;
            }

            if (!isStale) {
               count.trials++;
            } else count.noPayers++;
            return;
         }

         // 2️⃣ PAYMENTS → pelo menos um pagamento succeeded
         const hasSucceededPayment = licenses.some(
            (l: any) => l.payments && l.payments.some((p: any) => p.status_empresa_licenca_pagamento === "succeeded")
         );

         if (hasSucceededPayment) {
            count.payers++;
            return;
         }

         if (!company.feedback) {
            if (isStale) count.noFeedback++;
         }

         // 3️⃣ NO PAYMENTS → tem licença, mas nenhum succeeded
         count.noPayers++;
      });

      return count;
   }
}
