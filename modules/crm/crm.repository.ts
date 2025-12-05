import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class CRMRepository {
   async getPipelines() {
      return await db.crm_pipelines.findAll();
   }

   async getStages(pipelineId: string) {
      return await db.crm_pipeline_stages.findAll({ where: { pipelineId } });
   }

   async getAutomations(stageId?: string, status?: string) {
      let where = {} as any;
      if (stageId) where.stageId = stageId;
      if (status) where.status = status;
      return await db.crm_automations.findAll({ where });
   }

   async createOrEditAutomation(automation: any) {
      return await db.crm_automations.upsert(automation);
   }

   async deleteAutomation(automationId: string) {
      return await db.crm_automations.destroy({ where: { id: automationId } });
   }

   async onChangeStep(companyId: string, stageId: string) {
      return db.tab_empresa.update({ crmStepId: stageId }, { where: { cod_empresa: companyId } });
   }
}
