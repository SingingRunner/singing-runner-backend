import { UserGameDto } from 'src/user/dto/user.game.dto';
import { MatchMakingPolicy } from './match.making.policy';
import { UserMatchTier } from '../utill/game.enum';
export class mmrMatchPolicy implements MatchMakingPolicy {
  private tierQueueMap: Map<UserMatchTier, UserGameDto[]>;
  constructor() {
    this.tierQueueMap.set(UserMatchTier.BRONZE, []);
    this.tierQueueMap.set(UserMatchTier.SILVER, []);
    this.tierQueueMap.set(UserMatchTier.GOLD, []);
    this.tierQueueMap.set(UserMatchTier.PLATINUM, []);
    this.tierQueueMap.set(UserMatchTier.DIA, []);
  }

  joinQueue(userGameDto: UserGameDto) {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMMR,
    );
    this.tierQueueMap.get(userTier).push(userGameDto);
  }
  joinQueueAtFront(userGameDto: UserGameDto) {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMMR,
    );
    this.tierQueueMap.get(userTier).unshift(userGameDto);
  }
  leaveQueue(userGameDto: UserGameDto) {
    for (const key of this.tierQueueMap.keys()) {
      const usersInTier = this.tierQueueMap.get(key);

      const index = usersInTier.indexOf(userGameDto);
      if (index !== -1) {
        usersInTier.splice(index, 1);
        break;
      }
    }
  }
  isQueueReady(userGameDto: UserGameDto): boolean {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMMR,
    );
    const readyQueue: UserGameDto[] = this.tierQueueMap.get(userTier);
    if (readyQueue.length >= 2) {
      return true;
    }
    return false;
  }
  getAvailableUsers(userGameDto: UserGameDto): UserGameDto[] {
    const availableUsers: UserGameDto[] = [];
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMMR,
    );
    for (let i = 0; i < 2; i++) {
      availableUsers.push(this.tierQueueMap.get(userTier).shift());
    }

    return availableUsers;
  }

  private transformMMRtoTier(userMMR): UserMatchTier {
    if (userMMR < UserMatchTier.SILVER) {
      return UserMatchTier.BRONZE;
    }
    if (userMMR < UserMatchTier.GOLD) {
      return UserMatchTier.SILVER;
    }
    if (userMMR < UserMatchTier.PLATINUM) {
      return UserMatchTier.GOLD;
    }
    if (userMMR < UserMatchTier.DIA) {
      return UserMatchTier.PLATINUM;
    }
    return UserMatchTier.DIA;
  }
}
