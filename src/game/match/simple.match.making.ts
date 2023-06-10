import { Injectable } from '@nestjs/common';
import { MatchMakingPolicy } from './match.making.policy';
import { UserGameDto } from 'src/user/dto/user.game.dto';

@Injectable()
export class SimpleMatchMaking implements MatchMakingPolicy {
  private readyQueue: Array<UserGameDto> = [];

  public joinQueue(userGameDto: UserGameDto) {
    this.readyQueue.push(userGameDto);
  }

  public leaveQueue(userGameDto: UserGameDto) {
    return;
  }

  public isQueueReady(): boolean {
    return this.readyQueue.length == 3;
  }

  public getAvailableUsers(): UserGameDto[] {
    let availableUsers: UserGameDto[];

    for (let i = 0; i < 3; i++) {
      availableUsers.push(this.readyQueue.shift());
    }

    return availableUsers;
  }
}
