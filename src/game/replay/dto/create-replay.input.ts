import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateReplayInput {
  @Field(() => String)
  userId: string;

  @Field(() => Int)
  songId: number;

  @Field(() => String)
  userVocal: string;

  @Field(() => String)
  gameEvent: string;

  @Field(() => Date)
  createdAt: Date;
}
