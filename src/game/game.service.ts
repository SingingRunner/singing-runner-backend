import { GameRoomHandler } from './room/game.room.handler';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameRoom } from './room/game.room';
import { UserGameDto } from 'src/user/dto/user.game.dto';

@Injectable()
export class GameService {
  constructor(private gameRoomHandler: GameRoomHandler) {}

  public loadData(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    user.emit('loading', gameRoom.getGameSongDto);
  }

  public gameReady(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);

    this.gameRoomHandler.increaseAcceptCount(user);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      gameRoom.resetAcceptCount();
      this.broadCastGameRoom(gameRoom);
    }
  }

  public broadCastGameRoom(gameRoom: GameRoom) {
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    for (const user of userList) {
      user.getSocket().emit('game_ready', true);
    }
  }
}
