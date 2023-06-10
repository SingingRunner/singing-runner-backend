import { UserGameDto } from 'src/user/dto/user.game.dto';
import { MatchMakingPolicy } from './match/match.making.policy';
import { GameRoomHandler } from './room/game.room.handler';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject('MatchMakingPolicy')
    private matchMakingPolicy: MatchMakingPolicy,
  ) {}

  public isMatchingAvailable(userGameDto: UserGameDto): boolean {
    if (this.matchMakingPolicy.isQueueReady()) {
      return true;
    }
    this.matchMakingPolicy.joinQueue(userGameDto);
    return false;
  }
}
