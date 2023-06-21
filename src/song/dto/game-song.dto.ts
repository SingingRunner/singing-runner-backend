import { IsString, IsBoolean } from "class-validator";
import { Song } from "../entities/song.entity";
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

  songId: number;

  @IsString()
  songTitle: string;

  @IsString()
  singer: string;

  @IsString()
  songLyrics: string;

  @IsBoolean()
  songGender: boolean;

  @IsString()
  songMale: string;

  @IsString()
  songMaleUp: string;

  @IsString()
  songMaleDown: string;

  @IsString()
  songFemale: string;

  @IsString()
  songFemaleUp: string;

  @IsString()
  songFemaleDown: string;

  @IsString()
  vocalMale: string;

  @IsString()
  vocalMaleUp: string;

  @IsString()
  vocalMaleDown: string;

  @IsString()
  vocalFemale: string;

  @IsString()
  vocalFemaleUp: string;

  @IsString()
  vocalFemaleDown: string;
}
