import { IsString, IsBoolean } from "class-validator";
import { Song } from "../entities/song.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MatchCompleteSongDto } from "./match-complete-song.dto";

@ObjectType()
export class GameSongDto {
  constructor(song: Song) {
    this.songId = song.songId;
    this.songTitle = song.songTitle;
    this.singer = song.singer;
    this.songLyrics = song.songLyrics;
    this.songGender = song.songGender;
    this.songMale = song.songMale;
    this.songMaleUp = song.songMaleUp;
    this.songMaleDown = song.songMaleDown;
    this.songFemale = song.songFemale;
    this.songFemaleUp = song.songFemaleUp;
    this.songFemaleDown = song.songFemaleDown;
    this.vocalMale = song.vocalMale;
    this.vocalMaleUp = song.vocalMaleUp;
    this.vocalMaleDown = song.vocalMaleDown;
    this.vocalFemale = song.vocalFemale;
    this.vocalFemaleUp = song.vocalFemaleUp;
    this.vocalFemaleDown = song.vocalFemaleDown;
  }

  @Field(() => Int)
  songId: number;

  @IsString()
  @Field()
  songTitle: string;

  @IsString()
  @Field()
  singer: string;

  @IsString()
  @Field()
  songLyrics: string;

  @IsBoolean()
  @Field()
  songGender: boolean;

  @IsString()
  @Field()
  songMale: string;

  @IsString()
  @Field()
  songMaleUp: string;

  @IsString()
  @Field()
  songMaleDown: string;

  @IsString()
  @Field()
  songFemale: string;

  @IsString()
  @Field()
  songFemaleUp: string;

  @IsString()
  @Field()
  songFemaleDown: string;

  @IsString()
  @Field()
  vocalMale: string;

  @IsString()
  @Field()
  vocalMaleUp: string;

  @IsString()
  @Field()
  vocalMaleDown: string;

  @IsString()
  vocalFemale: string;

  @IsString()
  vocalFemaleUp: string;

  @IsString()
  vocalFemaleDown: string;

  public getMatchSong() {
    return new MatchCompleteSongDto(this.songTitle, this.singer);
  }
}
