import { UserGameDto } from "src/user/dto/user.game.dto";
import { UserMatchDto } from "src/user/dto/user.match.dto";

export interface MatchMakingPolicy {
  joinQueue(userGameDto: UserGameDto);
  joinQueueAtFront(userGameDto: UserGameDto);
  leaveQueue(userGameDto: UserGameDto);
  isQueueReady(userGameDto: UserGameDto): boolean;
  getAvailableUsers(userGameDto: UserGameDto): Array<UserGameDto>;
}
