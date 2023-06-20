import { IsString } from "class-validator";

export class MatchCompleteSongDto {
  constructor(songTitle: string, singer: string) {
    this.songTitle = songTitle;
    this.singer = singer;
  }
  @IsString()
  songTitle: string;

  @IsString()
  singer: string;

  toJSON() {
    return {
      songTitle: this.songTitle,
      singer: this.singer,
    };
  }
}
