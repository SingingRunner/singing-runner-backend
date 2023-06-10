import { Socket } from 'socket.io';
import { userActiveStatus, userKeynoteStatus } from '../util/user.enum';

export interface UserGameDto {
  userName: string;
  userMMR: number;
  nickname: string;
  userActive: userActiveStatus;
  userKeynote: userKeynoteStatus;
  socket: Socket;
}
