import { userActiveStatus, userKeynoteStatus } from '../util/user.enum';

export interface UserGameDto {
  userName: string;
  userMMR: number;
  nickname: string;
  userActive: userActiveStatus;
  userKeynote: userKeynoteStatus;
}
