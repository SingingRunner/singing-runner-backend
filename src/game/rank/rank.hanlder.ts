import { GameRoom } from "./../room/game.room";
import { UserScoreDto } from "./dto/user-score.dto";
export interface RankHandler {
  getUserScoreDto(gameRoom: GameRoom): UserScoreDto[];
  pushUserScore(gameRoom: GameRoom, userScoreDto: UserScoreDto);
  calculateRank(gameRoom: GameRoom);
}
