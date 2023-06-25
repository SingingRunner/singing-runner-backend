import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { SocialService } from "./social.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Social } from "./entity/social.entity";
import { SocialResolver } from "./social.resolver";
import { NotificationService } from "./notification/notification.service";
import { UserNotification } from "./notification/user.notification.entitiy";
import { Invite } from "./invite/invite";
import { User } from "src/user/entity/user.entity";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Social, User]),
    TypeOrmModule.forFeature([UserNotification]),
  ],
  providers: [SocialService, SocialResolver, NotificationService, Invite],
  exports: [SocialService],
})
export class SocialModule {}
