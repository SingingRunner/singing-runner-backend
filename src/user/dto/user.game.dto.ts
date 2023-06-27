import { Socket } from "socket.io";
import { UserMatchDto } from "./user.match.dto";
import { IsNotEmpty } from "@nestjs/class-validator";

export class UserGameDto {
  private queueEntryTime: number;
  @IsNotEmpty()
  private socket: Socket;
  private userMatchDto: UserMatchDto;

  constructor(socket: Socket, userMatchDto: UserMatchDto) {
    this.userMatchDto = userMatchDto;
    this.socket = socket;
    this.queueEntryTime = 0;
  }

  public getUserMatchDto(): UserMatchDto {
    return this.userMatchDto;
  }

  public getSocket(): Socket {
    return this.socket;
  }

  public setSocket(socket: Socket) {
    this.socket = socket;
  }

  public setQueueEntryTime(time: number) {
    this.queueEntryTime = time;
  }

  public getQueueEntryTime() {
    return this.queueEntryTime;
  }
}
