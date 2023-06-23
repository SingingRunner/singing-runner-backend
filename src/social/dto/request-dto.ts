import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RequestDto {
  constructor(senderId: string, senderNickname: string) {
    this.senderId = senderId;
    this.senderNickname = senderNickname;
  }
  @Field(() => String)
  senderId: string;

  @Field(() => String)
  senderNickname: string;
}
