import { Injectable } from "@nestjs/common";
import { MatchMakingPolicy } from "./match.making.policy";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { Socket } from "socket.io";


@Injectable()
export class SimpleMatchMaking implements MatchMakingPolicy {
  private readyQueue: Array<UserGameDto> = [];

  public joinQueue(userGameDto: UserGameDto) {
    this.readyQueue.push(userGameDto);
  }
  public joinQueueAtFront(UserGameDto: UserGameDto) {
    this.readyQueue.unshift(UserGameDto);
  }
  public leaveQueue(user: Socket) {
    this.readyQueue = this.readyQueue.filter(
      (userInQueue) => userInQueue.getSocket().id !== user.id,
    );
  }

  public isQueueReady(userGameDto: UserGameDto): boolean {
    return this.readyQueue.length >= 2;
  }

  public getAvailableUsers(): UserGameDto[] {
    const availableUsers: UserGameDto[] = [];

    for (let i = 0; i < 2; i++) {
      availableUsers.push(this.readyQueue.shift());
    }

    return availableUsers;
  }
}
