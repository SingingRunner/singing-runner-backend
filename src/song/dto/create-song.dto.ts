import { IsString, IsUrl, IsBoolean, IsUUID, IsDate } from 'class-validator';

export class CreateSongDto {
  @IsUUID('4')
  songId: Int16Array;

  @IsString()
  songTitle: string;

  @IsString()
  singer: string;

  @IsString()
  song_lylics: string;

  @IsUrl()
  song_file: string;

  @IsBoolean()
  song_gender: boolean;

  @IsUrl()
  song_male: string;

  @IsUrl()
  song_male_up: string;

  @IsUrl()
  song_male_down: string;

  @IsUrl()
  song_female: string;

  @IsUrl()
  song_female_up: string;

  @IsUrl()
  song_female_down: string;

  @IsUrl()
  vocal_male: string;

  @IsUrl()
  vocal_male_up: string;

  @IsUrl()
  vocal_male_down: string;

  @IsUrl()
  vocal_female: string;

  @IsUrl()
  vocal_female_up: string;

  @IsUrl()
  vocal_female_down: string;

  @IsDate()
  created_at: Date;
}
