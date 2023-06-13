import { IsString } from 'class-validator';

export class MatchCompleteSongDto {
  constructor(songTitle: string, singer: string) {
    songTitle = this.songTitle;
    singer = this.singer;
  }
  @IsString()
  songTitle: string;

  @IsString()
  singer: string;
}
