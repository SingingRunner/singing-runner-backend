import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { UserRepository } from 'src/auth/user/repository/user.repository';
import { userKeynoteStatus } from 'src/auth/user/util/user.enum';

export class GameUserDto extends PartialType(UserRepository) {
  @IsEnum(userKeynoteStatus)
  uerKeynote: userKeynoteStatus;
}
