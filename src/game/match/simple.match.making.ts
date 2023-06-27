import { Injectable } from "@nestjs/common";
import { MatchMakingPolicy } from "./match.making.policy";
import { UserGameDto } from "src/user/dto/user.game.dto";

@Injectable()
export class SimpleMatchMaking implements MatchMakingPolicy {
  private readyQueue: Array<UserGameDto> = [];

  public joinQueue(userGameDto: UserGameDto) {
    this.readyQueue.push(userGameDto);
  }
  public joinQueueAtFront(UserGameDto: UserGameDto) {
    this.readyQueue.unshift(UserGameDto);
  }
  public leaveQueue(userId: string) {
    this.readyQueue = this.readyQueue.filter(
      (userInQueue) => userInQueue.getUserMatchDto().userId !== userId
    );
  }

  public isQueueReady(): boolean {
    return this.readyQueue.length >= 2;
  }

  public getAvailableUsers(): UserGameDto[] {
    return this.readyQueue.splice(0, 2);
  }
}
