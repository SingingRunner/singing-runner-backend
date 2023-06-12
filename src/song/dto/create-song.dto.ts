import { IsString, IsUrl, IsBoolean, IsUUID, IsDate } from 'class-validator';

export class CreateSongDto {
  @IsUUID('4')
  songId: Int16Array;

  @IsString()
  songTitle: string;

  @IsString()
  singer: string;

  @IsString()
  songLylics: string;

  @IsUrl()
  songFile: string;

  @IsBoolean()
  songGender: boolean;

  @IsUrl()
  songMale: string;

  @IsUrl()
  songMaleUp: string;

  @IsUrl()
  songMaleDown: string;

  @IsUrl()
  songFemale: string;

  @IsUrl()
  songFemaleUp: string;

  @IsUrl()
  songFemaleDown: string;

  @IsUrl()
  vocalMale: string;

  @IsUrl()
  vocalMaleUp: string;

  @IsUrl()
  vocalMaleDown: string;

  @IsUrl()
  vocalFemale: string;

  @IsUrl()
  vocalFemaleUp: string;

  @IsUrl()
  vocalFemaleDown: string;

  @IsDate()
  createdAt: Date;
}
