import { UserGameDto } from "src/user/dto/user.game.dto";

export interface MatchMakingPolicy {
  joinQueue(userGameDto: UserGameDto);
  joinQueueAtFront(userGameDto: UserGameDto);
  leaveQueue(userId: string);
  isQueueReady(userGameDto: UserGameDto): boolean;
  getAvailableUsers(userGameDto: UserGameDto): Array<UserGameDto>;
}
