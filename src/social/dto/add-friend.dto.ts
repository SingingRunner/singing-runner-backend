import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AddFriendDto {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  friendId: string;
}
