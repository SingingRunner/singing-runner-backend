import { Injectable } from "@nestjs/common";
import { GameRoom } from "../room/game.room";

@Injectable()
export class TimeoutManager {
  private timeouts: Map<GameRoom, NodeJS.Timeout> = new Map();

  public set(gameRoom: GameRoom, callback: () => void, delay: number) {
    this.clear(gameRoom);
    const timeout = setTimeout(callback, delay);
    this.timeouts.set(gameRoom, timeout);
  }

  public clear(gameRoom: GameRoom) {
    if (this.timeouts.has(gameRoom)) {
      clearTimeout(this.timeouts.get(gameRoom));
      this.timeouts.delete(gameRoom);
    }
  }
}
