import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class NotificationDto {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  senderId: string;
}
