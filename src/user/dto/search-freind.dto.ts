import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserActiveStatus } from "../util/user.enum";
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
  userTier: string;

  @IsNotEmpty()
  @Field(() => String)
  nickname: string;

  @IsNotEmpty()
  @Field(() => Int)
  userActive: UserActiveStatus;

  @IsNotEmpty()
  @Field(() => String)
  character: string;
}
