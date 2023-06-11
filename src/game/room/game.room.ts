import { GameRoomStatus } from '../utill/game.enum';

export interface GameRoom {
  roomId: number;
  gameRoomStatus: GameRoomStatus;
  acceptCount: number;
}
