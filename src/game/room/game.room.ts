import { GameRoomStatus } from './../utill/game.enum';

export class GameRoom {
  private roomId: number;
  private gameRoomStatus: GameRoomStatus;
  private acceptCount: number;

  constructor(
    roomId: number,
    gameRoomStatus: GameRoomStatus,
    acceptCount: number,
  ) {
    this.roomId = roomId;
    this.gameRoomStatus = gameRoomStatus;
    this.acceptCount = acceptCount;
  }

  public getRoomId(): number {
    return this.roomId;
  }

  public getRoomStatus(): GameRoomStatus {
    return this.gameRoomStatus;
  }

  public getAcceptCount(): number {
    return this.acceptCount;
  }

  public increaseAcceptCount() {
    this.acceptCount += 1;
  }
}
