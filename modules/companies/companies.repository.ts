import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class CompaniesRepository {
   async findAll() {
      return await db.tab_empresa.findAll();
   }

   async findById(id: string) {
      return await db.tab_empresa.findByPk(id);
   }

   async findByEmail(email: string) {
      return await db.tab_empresa.findOne({ where: { email_empresa: email.trim() } });
   }

   async createOrUpdate(data: any) {
      return (await db.tab_empresa.upsert(data))[0];
   }

   async updateImageCompany(companyId: string, imageUrl: string) {
      return await db.tab_empresa.update({ imagem_empresa: imageUrl }, { where: { cod_empresa: companyId } });
   }

   async createOrUpdateCompanyLicense(data: any) {
      return (await db.tab_empresa_licenca.upsert(data))[0];
   }

   async cancelAllCompanyLicenses(companyId: string) {
      return await db.tab_empresa_licenca.update(
         { status_empresa_licenca: "Canceled" },
         { where: { cod_empresa: companyId } }
      );
   }

   async findAllCompaniesLicenses(companyId: string) {
      return await db.tab_empresa_licenca.findAll({
         include: [
            {
               model: db.tab_licenca,
               as: "licenca",
            },
            {
               model: db.tab_empresa_licenca_pagamento,
               as: "payments",
            },
         ],
         where: { cod_empresa: companyId },
         order: [["cod_empresa_licenca", "DESC"]],
      });
   }

   async findCompanyLicenseActive(companyId: string) {
      return await db.tab_empresa_licenca.findOne({
         include: [
            {
               model: db.tab_licenca,
               as: "licenca",
               required: true,
            },
            {
               model: db.tab_empresa_licenca_pagamento,
               as: "payments",
            },
         ],
         attributes: {
            include: [
               [db.Sequelize.col("licenca.nome_licenca"), "nome_licenca"],
               [db.Sequelize.col("licenca.valor_licenca"), "valor_licenca"],
               [db.Sequelize.col("licenca.descricao_licenca"), "descricao_licenca"],
               [db.Sequelize.col("licenca.mensal_licenca"), "mensal_licenca"],
               [db.Sequelize.col("licenca.prefix_licenca"), "prefix_licenca"],
            ],
         },
         where: { cod_empresa: companyId, status_empresa_licenca: "Active" },
         order: [["cod_empresa_licenca", "DESC"]],
         raw: true,
      });
   }

   async findCompanyLicenseById(id: string) {
      return await db.tab_empresa_licenca.findAll({
         include: [
            {
               model: db.tab_licenca,
               as: "licenca",
            },
            {
               model: db.tab_empresa_licenca_pagamento,
               as: "payments",
            },
         ],
         where: { cod_empresa_licenca: id },
         order: [["cod_empresa_licenca", "DESC"]],
      });
   }

   async findCompanyPaymentLicenseById(id: string) {
      return await db.tab_empresa_licenca_pagamento.findByPk(id, {
         include: [
            {
               model: db.tab_empresa_licenca,
               as: "empresaLicenca",
            },
         ],
      });
   }

   async getDashboardInfo(companyId: string) {
      const clientsLength = await db.tab_aluno.count({ where: { cod_empresa: companyId, status_aluno: "A" } });
      const usersLength = await db.tab_usuario.count({ where: { cod_empresa: companyId } });
      const physicalAssessmentsLength = await db.tab_avaliacao.count({
         include: [{ model: db.tab_usuario, as: "usuario", where: { cod_empresa: companyId } }],
      });
      const workoutLength = await db.tab_treino.count({ where: { cod_empresa: companyId } });

      const lastPhysicalAssessments = await db.tab_avaliacao.findAll({
         include: [
            { model: db.tab_usuario, as: "usuario", where: { cod_empresa: companyId } },
            { model: db.tab_aluno, as: "aluno" },
         ],
         order: [["data_avaliacao", "DESC"]],
         limit: 5,
      });

      return {
         lengths: {
            clients: clientsLength,
            users: usersLength,
            physicalAssessments: physicalAssessmentsLength,
            workouts: workoutLength,
         },
         lastPhysicalAssessments,
      };
   }

   async createFeedback(companyId: string, type: string, message: string) {
      return db.feedbacks.create({
         company_id: companyId,
         type,
         message,
      });
   }

   async getNewClientsDashboardByMonth() {
      const now = new Date();
      const monthsArr: string[] = [];

      // Criar array dos últimos 12 meses (abreviação Jan, Feb...)
      for (let i = 11; i >= 0; i--) {
         const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
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
         const companyMonth = new Date(company.createdAt).toLocaleString("en-US", { month: "short" }).toLowerCase();

         if (!newsClients[companyMonth]) return; // fora do período dos 12 meses

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

      console.log(newsClients);
      return newsClients;
   }
}
