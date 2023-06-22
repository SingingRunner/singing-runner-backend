import { Socket } from "socket.io";
import { UserGameDto } from "src/user/dto/user.game.dto";

export interface MatchMakingPolicy {
  joinQueue(userGameDto: UserGameDto);
  joinQueueAtFront(userGameDto: UserGameDto);
  leaveQueue(user: Socket);
  isQueueReady(userGameDto: UserGameDto): boolean;
  getAvailableUsers(userGameDto: UserGameDto): Array<UserGameDto>;
}
