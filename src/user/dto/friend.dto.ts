import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserActiveStatus } from "../util/user.enum";
import { characterEnum } from "../util/character.enum";

@ObjectType()
export class FriendDto {
  constructor(
    userId: string,
    nickname: string,
    userActive: UserActiveStatus,
    character: characterEnum,
    userMmr: number,
    userTier: string
  ) {
    this.userId = userId;
    this.nickname = nickname;
    this.userActive = userActive;
    this.character = character;
    this.userMmr = userMmr;
    this.userTier = userTier;
  }

  @Field(() => String)
  userId: string;

  @Field(() => String)
  nickname: string;

  @Field(() => Int)
  userActive: number;

  @Field(() => Int)
  userMmr: number;

  @Field(() => String)
  character: string;

  @Field(() => String)
  userTier: string;
}
