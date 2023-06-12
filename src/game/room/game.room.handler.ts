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

  public isGameRoomReady(gameRoom: GameRoom) {
    if (gameRoom.getAcceptCount() === 3) {
      return true;
    }
    return false;
  }

  public increaseAcceptCount(user: Socket) {
    const gameRoom: GameRoom = this.findRoomBySocket(user);
    gameRoom.increaseAcceptCount();
  }

  public findUsersInRoom(gameRoom: GameRoom): Array<UserGameDto> {
    return this.roomList.get(gameRoom);
  }

  public createRoom(): GameRoom {
    const gameRoom: GameRoom = new GameRoom(
      this.roomCount() + 1,
      GameRoomStatus.MATCHING,
      0,
    );
    this.roomList.set(gameRoom, []);
    return gameRoom;
  }

  public deleteRoom(user: Socket) {
    const gameRoom: GameRoom = this.findRoomBySocket(user);
    this.roomList.delete(gameRoom);
  }

  public findRoomBySocket(user: Socket): GameRoom {
    for (const key of this.roomList.keys()) {
      const foundUser = this.roomList
        .get(key)
        .find((userInRoom) => userInRoom.getSocket() === user);
      if (foundUser) {
        return key;
      }
    }
  }

  private roomCount(): number {
    return this.roomList.size;
  }
}
