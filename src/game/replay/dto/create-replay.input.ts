import { Field, InputType, Int } from "@nestjs/graphql";
import { User } from "src/user/entity/user.entity";

@InputType()
export class CreateReplayInput {
  @Field(() => User)
  user: User;

  @Field(() => String)
  userCharacter: string;

  @Field(() => Int)
  songId: number;

  @Field(() => String)
  userVocal: string;

  @Field(() => String)
  gameEvent: string;

  @Field(() => String)
  player1Id: string;

  @Field(() => String)
  player1Character: string;

  @Field(() => String)
  player2Id: string;

  @Field(() => String)
  player2Character: string;

  @Field(() => Int)
  keynote: number;
}
