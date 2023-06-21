import { GameRoom } from "./room/game.room";
import { GameRoomHandler } from "./room/game.room.handler";
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { UserGameDto } from "src/auth/user/dto/user.game.dto";
import { UserMatchDto } from "src/auth/user/dto/user.match.dto";

@Injectable()
export class CustomModeService {
  constructor(private gameRoomHandler: GameRoomHandler) {}

  public async createCustomRoom(user: Socket, userMatchDto: UserMatchDto) {
    const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);
    const gameRoom: GameRoom = await this.gameRoomHandler.createRoom();
    this.gameRoomHandler.joinRoom(gameRoom, userGameDto);
    gameRoom.setRoomMaster(userMatchDto.userId);
  }

  public joinCustomRoom(
    user: Socket,
    userMatchDto: UserMatchDto,
    gameRoom: GameRoom
  ) {
    const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);
    this.gameRoomHandler.joinRoom(gameRoom, userGameDto);
  }

  public findRoomByUserId(roomMaster: string): GameRoom {
    return this.gameRoomHandler.findRoomByUserId(roomMaster);
  }
}
