import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameRoom } from './game.room';
import { UserGameDto } from 'src/user/dto/user.game.dto';
import { GameRoomStatus } from '../utill/game.enum';

@Injectable()
export class GameRoomHandler {
  private roomList: Map<GameRoom, Array<UserGameDto>> = new Map();

  public addUser(gameRoom: GameRoom, userGameDto: UserGameDto) {
    const userList: Array<UserGameDto> = this.roomList.get(gameRoom);
    userList.push(userGameDto);
    if (userList.length >= 3) {
      gameRoom.gameRoomStatus = GameRoomStatus.INGAME;
    }
  }

  public findEmptyRoom(): GameRoom {
    for (const key of this.roomList.keys()) {
      if (key.gameRoomStatus === GameRoomStatus.MATCHING) {
        return key;
      }
    }
    return this.createRoom();
  }

  public findUsersInRoom(client: Socket): Array<UserGameDto> {
    for (const userList of this.roomList.values()) {
      const foundUserSocket = userList.find((user) => user.socket === client);
      if (foundUserSocket) {
        return userList;
      }
    }
  }

  private roomCount(): number {
    return this.roomList.size;
  }

  private createRoom(): GameRoom {
    const gameRoom: GameRoom = {
      roomId: this.roomCount() + 1,
      gameRoomStatus: GameRoomStatus.MATCHING,
    };
    this.roomList.set(gameRoom, []);
    return gameRoom;
  }
}
