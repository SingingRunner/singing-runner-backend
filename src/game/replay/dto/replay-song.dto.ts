import { Field, ObjectType } from "@nestjs/graphql";
import { Song } from "src/song/entities/song.entity";

@ObjectType()
export class ReplaySongDto {
  @Field(() => String)
  songTitle: string;

  @Field(() => String)
  singer: string;

  @Field(() => String)
  songLyrics: string;

  @Field(() => Boolean)
  songGender: boolean;

  @Field(() => String)
  songMale: string;

  @Field(() => String)
  songMaleUp: string;

  @Field(() => String)
  songMaleDown: string;

  @Field(() => String)
  songFemale: string;

  @Field(() => String)
  songFemaleUp: string;

  @Field(() => String)
  songFemaleDown: string;

  constructor(song: Song) {
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
  }
}
