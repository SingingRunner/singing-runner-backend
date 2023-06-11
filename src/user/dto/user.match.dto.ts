import { userActiveStatus, userKeynoteStatus } from '../util/user.enum';
import { IsNotEmpty, isNotEmpty } from '@nestjs/class-validator';

export class UserMatchDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userMMR: number;

  @IsNotEmpty()
  nickName: string;

  @IsNotEmpty()
  userActive: userActiveStatus;

  @IsNotEmpty()
  userKeynote: userKeynoteStatus;
}
