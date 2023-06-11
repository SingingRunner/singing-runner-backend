import { GameRoomHandler } from './room/game.room.handler';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameRoom } from './room/game.room';

@Injectable()
export class GameService {
  constructor(private gameRoomHandler: GameRoomHandler) {}

  public loadData(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    user.emit('loading', gameRoom.getGameSongDto);
  }
}
