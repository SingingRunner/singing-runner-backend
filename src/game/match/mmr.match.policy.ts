import { MatchMakingPolicy } from "./match.making.policy";
import { UserMatchTier } from "../util/game.enum";
import { UserGameDto } from "src/user/dto/user.game.dto";

export class MMRMatchPolicy implements MatchMakingPolicy {
  private tierQueueMap: Map<UserMatchTier, UserGameDto[]> = new Map();
  constructor() {
    this.tierQueueMap.set(UserMatchTier.BRONZE, []);
    this.tierQueueMap.set(UserMatchTier.SILVER, []);
    this.tierQueueMap.set(UserMatchTier.GOLD, []);
    this.tierQueueMap.set(UserMatchTier.PLATINUM, []);
    this.tierQueueMap.set(UserMatchTier.DIAMOND, []);
    // this.startQueueMovement(10000);
  }

  public joinQueue(userGameDto: UserGameDto) {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMmr
    );
    this.tierQueueMap.get(userTier)?.push(userGameDto);
  }

  public joinQueueAtFront(userGameDto: UserGameDto) {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMmr
    );
    this.tierQueueMap.get(userTier)?.unshift(userGameDto);
  }

  public leaveQueue(userId: string) {
    for (const key of this.tierQueueMap.keys()) {
      let usersInQueue = this.tierQueueMap.get(key);

      if (usersInQueue !== undefined) {
        usersInQueue = usersInQueue.filter(
          (userInQueue) => userInQueue.getUserMatchDto().userId !== userId
        );

        this.tierQueueMap.set(key, usersInQueue);
      }
    }
  }

  public isQueueReady(userGameDto: UserGameDto): boolean {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMmr
    );
    const readyQueue: UserGameDto[] | undefined =
      this.tierQueueMap.get(userTier);
    if (readyQueue !== undefined && readyQueue.length >= 2) {
      return true;
    }
    return false;
  }

  public getAvailableUsers(userGameDto: UserGameDto): UserGameDto[] {
    if (
      !userGameDto ||
      !userGameDto.getUserMatchDto() ||
      userGameDto.getUserMatchDto().userMmr == null
    ) {
      throw new Error("Invalid userGameDto or userMMR");
    }

    const userMMR = userGameDto.getUserMatchDto().userMmr;
    const userTier: UserMatchTier = this.transformMMRtoTier(userMMR);

    const matchQueue = this.tierQueueMap.get(userTier);
    if (!matchQueue || matchQueue.length < 2) {
      throw new Error("Not enough available users");
    }

    return matchQueue.splice(0, 2);
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
    if (userMMR < UserMatchTier.DIAMOND) {
      return UserMatchTier.PLATINUM;
    }
    return UserMatchTier.DIAMOND;
  }
}
