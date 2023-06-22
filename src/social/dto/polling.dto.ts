import { UserNotification } from "./../notification/user.notification.entitiy";
import { Field, ObjectType } from "@nestjs/graphql";
import { HostUserDto } from "src/user/dto/host-user.dto";

@ObjectType()
export class PollingDto {
  @Field(() => [HostUserDto])
  hostUserDtoList: HostUserDto[];

  @Field(() => [UserNotification])
  userNotificationList: UserNotification[];
}
