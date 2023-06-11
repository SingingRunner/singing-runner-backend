import { GameRoomHandler } from './room/game.room.handler';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  constructor(private GameRoomHandler: GameRoomHandler) {}
}
