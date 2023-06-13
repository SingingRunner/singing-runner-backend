import { IsString, IsBoolean } from 'class-validator';

export class GameSongDto {
  @IsString()
  songTitle: string;

  @IsString()
  singer: string;

  @IsString()
  songLyrics: string;

  @IsString()
  songFile: string;

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
