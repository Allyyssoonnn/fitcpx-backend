import { Module } from "@nestjs/common";
import { ContractsTemplatesController } from "./contractsTemplates.controller";
import { ContractsTemplatesRepository } from "./contractsTemplates.repository";
import { ContractsTemplatesService } from "./contractsTemplates.service";

@Module({
   controllers: [ContractsTemplatesController],
   providers: [ContractsTemplatesRepository, ContractsTemplatesService],
})
export class ContractsTemplatesModule {}
