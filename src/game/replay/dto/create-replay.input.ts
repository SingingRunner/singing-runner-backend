import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateReplayInput {
  @Field(() => String)
  userId: string;

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
