import { Module } from "@nestjs/common";
import { WPAPI } from "./wp.api";
import { WPController } from "./wp.controller";
import { WPRepository } from "./wp.repository";
import { WPService } from "./wp.service";

@Module({
   controllers: [WPController],
   providers: [WPService, WPAPI, WPRepository],
})
export class WPModule {}
