import { Field, Int, ObjectType } from "@nestjs/graphql";
import { userActiveStatus } from "../util/user.enum";
import { IsNotEmpty } from "@nestjs/class-validator";

@ObjectType()
export class SearchFriendDto {
  @IsNotEmpty()
  @Field(() => String)
  userId: string;

  @IsNotEmpty()
  @Field(() => Int)
  userMmr: number;

  @IsNotEmpty()
  @Field(() => String)
  nickname: string;

  @IsNotEmpty()
  @Field(() => Int)
  userActive: userActiveStatus;

  @IsNotEmpty()
  @Field(() => String)
  character: string;
}
