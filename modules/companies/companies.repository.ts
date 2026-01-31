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

   async updateApiId(companyId: string, apiId: string | null) {
      return await db.tab_empresa.update({ asaas_id: apiId }, { where: { cod_empresa: companyId } });
   }

   async updateCRMId(companyId: string, crmID: string | null) {
      return await db.tab_empresa.update({ crm_id: crmID }, { where: { cod_empresa: companyId } });
   }

   async applyCoupon(companyId: string, coupon: string | null, dueDate?: string) {
      var dueDateInsert = dueDate ? dueDate : null;
      return await db.tab_empresa.update(
         { cupom_empresa_licenca: coupon, expiracaocupom_empresa_licenca: dueDateInsert },
         { where: { cod_empresa: companyId } },
      );
   }

   async createOrUpdateCompanyLicense(data: any) {
      return (await db.tab_empresa_licenca.upsert(data))[0];
   }

   async cancelAllCompanyLicenses(companyId: string) {
      return await db.tab_empresa_licenca.update(
         { status_empresa_licenca: "Canceled" },
         { where: { cod_empresa: companyId } },
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

   async getOlderPhysicalAssessments(companyId: string) {
      return db.tab_avaliacao.findAll({
         attributes: [
            "cod_aluno",
            [db.sequelize.fn("MAX", db.sequelize.col("data_avaliacao")), "ultima_avaliacao"],
            [db.sequelize.literal(`DATEDIFF(NOW(), MAX(data_avaliacao))`), "dias_sem_avaliacao"],
         ],
         include: [{ model: db.tab_aluno, as: "aluno", where: { status_aluno: "A", cod_empresa: companyId } }],
         group: ["tab_avaliacao.cod_aluno", "aluno.cod_aluno"],
         order: [[db.sequelize.literal("dias_sem_avaliacao"), "DESC"]],
         limit: 5,
      });
   }

   async getDashboardInfo(companyId: string) {
      const clientsLength = await db.tab_aluno.count({ where: { cod_empresa: companyId, status_aluno: "A" } });
      const usersLength = await db.tab_usuario.count({ where: { cod_empresa: companyId } });
      const physicalAssessmentsLength = await db.tab_avaliacao.count({
         include: [{ model: db.tab_usuario, as: "usuario", where: { cod_empresa: companyId } }],
      });
      const workoutLength = await db.tab_treino.count({ where: { cod_empresa: companyId } });

      return {
         lengths: {
            clients: clientsLength,
            users: usersLength,
            physicalAssessments: physicalAssessmentsLength,
            workouts: workoutLength,
         },
      };
   }

   async createFeedback(companyId: string, type: string, message: string) {
      return db.feedbacks.create({
         company_id: companyId,
         type,
         message,
      });
   }

   async saveNotificationsConfig(companyId: string, notifications: string) {
      return db.tab_empresa.update({ notifications_config: notifications }, { where: { cod_empresa: companyId } });
   }

   async getNotificationsConfig(companyId?: string, studentId?: string) {
      var where = {} as any;
      if (companyId) where.cod_empresa = companyId;
      if (!companyId && studentId) {
         const student = (await db.tab_aluno.findOne({ where: { cod_aluno: studentId } })) as any;
         if (student?.cod_empresa) where.cod_empresa = student.cod_empresa;
      }
      const notifications = (await db.tab_empresa.findOne({
         where: where,
         attributes: ["notifications_config"],
      })) as any;
      return JSON.parse(notifications.notifications_config);
   }

   async verifyNotificationConfig(
      keyConfig: string,
      type: "email" | "app" | "whatsapp",
      companyId?: string,
      studentId?: string,
   ) {
      const config = await this.getNotificationsConfig(companyId, studentId);
      if (typeof config?.[keyConfig]?.[type] === "boolean") {
         return config[keyConfig][type];
      } else {
         return true;
      }
   }

   async verifyStudentNotificationConfig(keyConfig: string, type: "email" | "app" | "whatsapp", studentId?: string) {
      const config = await this.getNotificationsConfig(undefined, studentId);
      if (typeof config?.[keyConfig]?.[type] === "boolean") {
         return config[keyConfig][type];
      } else {
         return true;
      }
   }

   async getCompanyAndPlans(companyId: string) {
      const plans = (await db.tab_plano.findAll({
         where: { cod_empresa: companyId, vende_online: "S" },
      })) as any;

      const company = (await db.tab_empresa.findOne({
         where: { cod_empresa: companyId },
      })) as any;

      return {
         company: {
            companyId: company?.cod_empresa,
            name: company?.nome_empresa,
            address: company?.endereco_empresa,
            phone: company?.telefone_empresa,
            email: company?.email_empresa,
            img: company?.imagem_empresa,
         },
         plans:
            plans?.map((plan: any) => ({
               value: plan.cod_plano,
               label: plan.nome_plano,
               price: plan.valor_plano + (plan.valor_adesao || 0),
               joiningFee: plan.valor_adesao,
               duration: plan.duracao_plano,
               max_installments: plan.maximo_parcelas,
               allowMonthly: plan.vende_recorrencia === "S",
               contractId: plan.cod_contrato,
            })) ?? [],
      };
   }
}
