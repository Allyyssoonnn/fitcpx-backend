import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CRMService } from "./crm.service";

@Controller("crm")
export class CRMController {
   constructor(private readonly crmService: CRMService) {}

   @Get("onChangeStep")
   async sendUserMessage(@Query("companyId") companyId: string, @Query("stageId") stageId: string) {
      return this.crmService.onChangeStep(companyId, stageId);
   }

   @Get("getPipelines")
   async getPipelines() {
      return this.crmService.getPipelines();
   }

   @Get("getStages")
   async getStages(@Query("pipelineId") pipelineId: string) {
      return this.crmService.getStages(pipelineId);
   }

   @Get("getAutomations")
   async getAutomations() {
      return this.crmService.getAutomations();
   }

   @Post("createOrEditAutomation")
   async createOrEditAutomation(@Body() automation: any) {
      return this.crmService.createOrEditAutomation(automation);
   }

   @Post("onSendFeedback")
   async onSendFeedback(@Query("companyId") companyId: string, @Body("message") message: string) {
      return this.crmService.onSendFeedback(companyId, message);
   }

   @Get("deleteAutomation")
   async deleteAutomation(@Query("automationId") automationId: string) {
      return this.crmService.deleteAutomation(automationId);
   }
}
