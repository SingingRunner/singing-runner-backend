import { PartialType } from '@nestjs/mapped-types';
import { GameSongDto } from './game-song.dto';
import { IsString } from 'class-validator';

export class MatchCompleteSongDto extends PartialType(GameSongDto) {
  @IsString()
  songTitle: string;

  @IsString()
  singer: string;
}
