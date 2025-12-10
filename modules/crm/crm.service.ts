import { Injectable } from "@nestjs/common";
import { CompaniesRepository } from "../companies/companies.repository";
import { CRMAPI } from "./crm.api";
import { CRMRepository } from "./crm.repository";

@Injectable()
export class CRMService {
   constructor(
      private readonly crmApi: CRMAPI,
      private readonly crmRepository: CRMRepository,
      private readonly companiesRepository: CompaniesRepository
   ) {}

   async onChangeStep(companyId: string, stageId: string) {
      //EXECUTE AUTOMATIONS
      this.getAutomations(stageId, "active").then(async (automations) => {
         if (!!automations) {
            for (const automation of automations as any) {
               const company = (await this.companiesRepository.findById(companyId)) as any;
               if (company.telefone_empresa && automation.message) {
                  var phone = company.telefone_empresa.replace(/\D/g, "");
                  if (!phone.includes("55")) phone = "55" + phone;
                  this.crmApi.sendMessage(phone, automation.message, automation.delay);
               }
            }
         }
      });

      return this.crmRepository.onChangeStep(companyId, stageId);
   }

   async checkIsWhatsapp(number: string) {
      return this.crmApi.checkIsWhatsapp(number);
   }

   async getAutomations(stageId?: string, status?: string) {
      return this.crmRepository.getAutomations(stageId, status);
   }

   async createOrEditAutomation(automation: any) {
      return await this.crmRepository.createOrEditAutomation(automation);
   }

   async createOrEditStage(stage: any) {
      return await this.crmRepository.createOrEditStage(stage);
   }

   async deleteAutomation(automationId: string) {
      return await this.crmRepository.deleteAutomation(automationId);
   }

   async deleteStage(stageId: string) {
      return await this.crmRepository.deleteStage(stageId);
   }

   async getPipelines() {
      return this.crmRepository.getPipelines();
   }

   async onSendFeedback(companyId: string, message: string) {
      return this.crmRepository.onSendFeedback(companyId, message);
   }

   async getStages(pipelineId: string) {
      return this.crmRepository.getStages(pipelineId);
   }

   async reorderStages(stages: any[]) {
      for (let i = 0; i < stages.length; i++) {
         await this.crmRepository.updateSequence(stages[i].id, (i + 1).toString());
      }
      return true;
   }
}
