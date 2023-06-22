import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { SocialService } from "./social.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Social } from "./entity/social.entity";

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Social])],
  providers: [SocialService],
})
export class SocialModule {}
