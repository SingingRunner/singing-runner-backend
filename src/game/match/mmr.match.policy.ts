import { MatchMakingPolicy } from "./match.making.policy";
import { UserMatchTier } from "../util/game.enum";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Queue } from "src/lib/Queue/queue";

export class MMRMatchPolicy implements MatchMakingPolicy {
  private tierQueueMap: Map<UserMatchTier, Queue<UserGameDto>> = new Map();
  constructor() {
    this.tierQueueMap.set(UserMatchTier.BRONZE, new Queue<UserGameDto>());
    this.tierQueueMap.set(UserMatchTier.SILVER, new Queue<UserGameDto>());
    this.tierQueueMap.set(UserMatchTier.GOLD, new Queue<UserGameDto>());
    this.tierQueueMap.set(UserMatchTier.PLATINUM, new Queue<UserGameDto>());
    this.tierQueueMap.set(UserMatchTier.DIAMOND, new Queue<UserGameDto>());
    // this.startQueueMovement(10000);
  }
  public joinQueue(userGameDto: UserGameDto) {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMmr
    );
    if (this.isUserInQueue(this.tierQueueMap.get(userTier)!, userGameDto)) {
      this.leaveQueue(userGameDto.getUserMatchDto().userId);
    }
    this.tierQueueMap.get(userTier)?.enqueue(userGameDto);
  }

  public joinQueueAtFront(userGameDto: UserGameDto) {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMmr
    );
    this.tierQueueMap.get(userTier)?.prepend(userGameDto);
  }
  private isUserInQueue(
    queue: Queue<UserGameDto>,
    userGameDto: UserGameDto
  ): boolean {
    return Array.from(queue).some(
      (user) =>
        user.getUserMatchDto().userId === userGameDto.getUserMatchDto().userId
    );
  }
  public leaveQueue(userId: string) {
    for (const tier of this.tierQueueMap.keys()) {
      const queue = this.tierQueueMap.get(tier);
      if (queue) {
        const filteredQueue = queue.filter(
          (user) => user.getUserMatchDto().userId !== userId
        );
        this.tierQueueMap.set(tier, filteredQueue);
      }
    }
  }

  public isQueueReady(userGameDto: UserGameDto): boolean {
    const userTier: UserMatchTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMmr
    );
    const readyQueue: Queue<UserGameDto> | undefined =
      this.tierQueueMap.get(userTier);
    if (readyQueue === undefined) {
      return false;
    }
    for (const readyUser of readyQueue) {
      if (
        readyUser.getUserMatchDto().userId ===
        userGameDto.getUserMatchDto().userId
      ) {
        this.leaveQueue(readyUser.getUserMatchDto().userId);
        return false;
      }
    }
    if (readyQueue.size() >= 2) {
      return true;
    }
    return false;
  }

  public getAvailableUsers(userGameDto: UserGameDto): UserGameDto[] {
    const userTier = this.transformMMRtoTier(
      userGameDto.getUserMatchDto().userMmr
    );
    const queue = this.tierQueueMap.get(userTier);
    if (!queue || queue.size() < 2) {
      throw new HttpException(
        "Not enough users in the queue",
        HttpStatus.BAD_REQUEST
      );
    }
    return [queue.dequeue()!, queue.dequeue()!];
  }

  private transformMMRtoTier(userMMR): UserMatchTier {
    if (userMMR < UserMatchTier.SILVER) return UserMatchTier.BRONZE;
    if (userMMR < UserMatchTier.GOLD) return UserMatchTier.SILVER;
    if (userMMR < UserMatchTier.PLATINUM) return UserMatchTier.GOLD;
    if (userMMR < UserMatchTier.DIAMOND) return UserMatchTier.PLATINUM;
    return UserMatchTier.DIAMOND;
  }
}
