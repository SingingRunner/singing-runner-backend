import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RequestDto {
  constructor(senderId: string, senderNickname: string, receivedAt: Date) {
    this.senderId = senderId;
    this.senderNickname = senderNickname;
    this.receivedAt = receivedAt;
  }
  @Field(() => String)
  senderId: string;

  @Field(() => String)
  senderNickname: string;

  @Field(() => Date)
  receivedAt: Date;
}
