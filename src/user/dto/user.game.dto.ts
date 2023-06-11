import { Socket } from 'socket.io';
import { UserMatchDto } from './user.match.dto';
import { IsNotEmpty } from '@nestjs/class-validator';

export class UserGameDto {
  @IsNotEmpty()
  private socket: Socket;
  private userMatchDto: UserMatchDto;

  constructor(socket: Socket, userMatchDto: UserMatchDto) {
    this.userMatchDto = userMatchDto;
    this.socket = socket;
  }

  public getUserMatchDto(): UserMatchDto {
    return this.userMatchDto;
  }

  public getSocket(): Socket {
    return this.socket;
  }
}
