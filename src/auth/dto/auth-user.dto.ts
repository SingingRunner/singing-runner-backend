import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthUserDto {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  nickname: string;

  @Field(() => Int)
  userActive: number;

  @Field(() => Int)
  userKeynote: number;

  @Field(() => Int)
  userMmr: number;

  @Field(() => Int)
  userPoint: number;

  @Field(() => String)
  character: string;

  @Field(() => String)
  userTier: string;
}
