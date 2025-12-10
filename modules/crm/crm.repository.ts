import { Injectable } from "@nestjs/common";
import db from "../../database/models";

@Injectable()
export class CRMRepository {
   async getPipelines() {
      return await db.crm_pipelines.findAll();
   }

   async getStages(pipelineId: string) {
      return await db.crm_pipeline_stages.findAll({ where: { pipelineId }, order: [["sequence", "ASC"]] });
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

   async createOrEditStage(stage: any) {
      const stagesCount = await db.crm_pipeline_stages.count({
         where: { pipelineId: stage.pipelineId },
      });
      return await db.crm_pipeline_stages.upsert({ ...stage, sequence: stage.sequence ?? stagesCount + 1 });
   }

   async deleteAutomation(automationId: string) {
      return await db.crm_automations.destroy({ where: { id: automationId } });
   }

   async deleteStage(stageId: string) {
      return await db.crm_pipeline_stages.destroy({ where: { id: stageId } });
   }

   async onChangeStep(companyId: string, stageId: string) {
      return db.tab_empresa.update({ crmStepId: stageId }, { where: { cod_empresa: companyId } });
   }

   async onSendFeedback(companyId: string, message: string) {
      return db.tab_empresa.update({ feedback: message }, { where: { cod_empresa: companyId } });
   }

   async updateSequence(stageId: string, sequence: string) {
      return db.crm_pipeline_stages.update({ sequence }, { where: { id: stageId } });
   }
}
