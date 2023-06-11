import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameRoom } from './game.room';
import { UserGameDto } from 'src/user/dto/user.game.dto';
import { GameRoomStatus } from '../utill/game.enum';

@Injectable()
export class GameRoomHandler {
  private roomList: Map<GameRoom, Array<UserGameDto>> = new Map();

  public addUser(gameRoom: GameRoom, userList: Array<UserGameDto>) {
    for (const user of userList) {
      this.roomList.get(gameRoom).push(user);
    }
  }

  public findRoomBySocket(user: Socket): GameRoom {
    for (const key of this.roomList.keys()) {
      const foundUser = this.roomList
        .get(key)
        .find((userInRoom) => userInRoom.socket === user);
      if (foundUser) {
        return key;
      }
    }
  }

  public findUsersInRoom(user: Socket): Array<UserGameDto> {
    for (const userList of this.roomList.values()) {
      const foundUser = userList.find(
        (userInRoom) => userInRoom.socket === user,
      );
      if (foundUser) {
        return userList;
      }
    }
  }

  public createRoom(): GameRoom {
    const gameRoom: GameRoom = {
      roomId: this.roomCount() + 1,
      gameRoomStatus: GameRoomStatus.MATCHING,
      acceptCount: 0,
    };
    this.roomList.set(gameRoom, []);
    return gameRoom;
  }

  private roomCount(): number {
    return this.roomList.size;
  }
}
