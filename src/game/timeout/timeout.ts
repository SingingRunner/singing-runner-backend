import { GameRoom } from "../room/game.room";

export class TimeoutManager {
  private timeouts: Map<GameRoom, NodeJS.Timeout> = new Map();

  public set(userId: GameRoom, callback: () => void, delay: number) {
    this.clear(userId);
    const timeout = setTimeout(callback, delay);
    this.timeouts.set(userId, timeout);
  }

  public clear(userId: GameRoom) {
    if (this.timeouts.has(userId)) {
      clearTimeout(this.timeouts.get(userId));
      this.timeouts.delete(userId);
    }
  }
}
