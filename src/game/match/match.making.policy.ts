import { UserGameDto } from "src/user/dto/user.game.dto";

export interface MatchMakingPolicy {
  joinQueue(userGameDto: UserGameDto);
  joinQueueAtFront(userGameDto: UserGameDto);
  leaveQueue(userSocketDto: UserGameDto);
  isQueueReady(): boolean;
  getAvailableUsers(): Array<UserGameDto>;
}
