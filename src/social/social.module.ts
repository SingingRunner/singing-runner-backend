import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { SocialService } from "./social.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Social } from "./entity/social.entity";
import { SocialResolver } from "./social.resolver";
import { NotificationService } from "./notification/notification.service";
import { UserNotification } from "./notification/user.notification.entitiy";
import { Invite } from "./invite/invite";
import { HeartBeatimpl } from "./heartbeat/heartbeat.impl";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Social]),
    TypeOrmModule.forFeature([UserNotification]),
  ],
  providers: [
    SocialService,
    SocialResolver,
    NotificationService,
    Invite,
    {
      provide: "HeartBeat",
      useClass: HeartBeatimpl,
    },
  ],
  exports: [SocialService, "HeartBeat"],
})
export class SocialModule {}
