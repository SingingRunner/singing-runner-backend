import { ObjectType, Field, Int } from "@nestjs/graphql";
import { ReplayUserInfoDto } from "./replay-user-info.dto";
import { ReplaySongDto } from "./replay-song.dto";

@ObjectType()
export class ReplayInfoDto {
  @Field(() => String)
  userVocal: string;

  @Field(() => String)
  gameEvent: string;

  @Field(() => Int)
  replayKeynote: number;

  @Field(() => ReplaySongDto)
  gameSong: ReplaySongDto;

  @Field(() => [ReplayUserInfoDto])
  characterList: ReplayUserInfoDto[];
}
