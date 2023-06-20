import { MatchMakingPolicy } from "./match.making.policy";
import { UserMatchTier } from "../utill/game.enum";
import { Socket } from "socket.io";
import { UserGameDto } from "src/auth/user/dto/user.game.dto";

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
      userGameDto.getUserMatchDto().userMMR
    );
    userGameDto.setQueueEntryTime(Date.now());
    this.tierQueueMap.get(userTier)?.push(userGameDto);
  }

  public joinQueueAtFront(userGameDto: UserGameDto) {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMMR
    );
    this.tierQueueMap.get(userTier)?.unshift(userGameDto);
  }

  public leaveQueue(user: Socket) {
    for (const key of this.tierQueueMap.keys()) {
      let usersInQueue = this.tierQueueMap.get(key);

      if (usersInQueue !== undefined) {
        usersInQueue = usersInQueue.filter(
          (userInQueue) => userInQueue.getSocket().id !== user.id
        );

        this.tierQueueMap.set(key, usersInQueue);
      }
    }
  }

  public isQueueReady(userGameDto: UserGameDto): boolean {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMMR
    );
    console.log("isQ ready", userTier);
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
      userGameDto.getUserMatchDto().userMMR == null
    ) {
      throw new Error("Invalid userGameDto or userMMR");
    }

    const userMMR = userGameDto.getUserMatchDto().userMMR;
    const userTier: UserMatchTier = this.transformMMRtoTier(userMMR);

    const matchQueue = this.tierQueueMap.get(userTier);
    if (!matchQueue || matchQueue.length < 2) {
      throw new Error("Not enough available users");
    }

    return matchQueue.splice(0, 2);
  }

  //   private checkStarvationUser() {
  //     const date = Date.now();
  //     for (const key of this.tierQueueMap.keys()) {
  //       const usersInQueue: UserGameDto[] = this.tierQueueMap.get(key);
  //       if (usersInQueue.length == 0) {
  //         continue;
  //       }
  //       if (key == UserMatchTier.BRONZE) {
  //         continue;
  //       }
  //       console.log('key : ', key);
  //       console.log('userinQueue : ', usersInQueue);
  //       console.log(date);
  //       for (const user of usersInQueue) {
  //         if (date - user.getQueueEntryTime() >= 10000) {
  //           this.leaveQueue(user);
  //           const tier: UserMatchTier = user.getUserMatchDto().userMMR;
  //           console.log('move tier Queue : ', tier - 1000);
  //           this.tierQueueMap.get(tier - 1000).push(user);
  //           const userList: UserGameDto[] = this.tierQueueMap.get(tier - 1000);
  //           for (const user of userList) {
  //             user.setQueueEntryTime(Date.now());
  //           }
  //         }
  //       }
  //     }
  //   }

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

  //   private startQueueMovement(interval: number) {
  //     setInterval(() => {
  //       this.checkStarvationUser();
  //     }, interval);
  //   }
}
