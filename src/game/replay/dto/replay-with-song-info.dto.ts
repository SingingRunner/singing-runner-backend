import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class ReplayWithSongInfo {
  @Field(() => Int)
  replayId: number;

  //   @Field(() => String)
  //   userVocal: string;

  //   @Field(() => String)
  //   gameEvent: string;

  @Field(() => Date)
  createdAt: Date;

  //   @Field(() => Date, { nullable: true })
  //   deletedAt: Date | null;

  //   @Field(() => Int)
  //   keynote: number;

  @Field(() => Int)
  isPublic: number;

  //   @Field(() => String)
  //   userCharacter: string;

  //   @Field(() => String)
  //   player1Id: string;

  //   @Field(() => String)
  //   player1Character: string;

  //   @Field(() => String)
  //   player2Id: string;

  //   @Field(() => String)
  //   player2Character: string;

  //   @Field(() => Int)
  //   songId: number;

  @Field(() => String)
  songTitle: string;

  @Field(() => String)
  singer: string;
}
