import { UserGameDto } from "src/user/dto/user.game.dto";
import { GameRoom } from "./../room/game.room";
import { UserScoreDto } from "./dto/user-score.dto";
export interface RankHandler {
  getUserScoreDto(gameRoom: GameRoom): UserScoreDto[];
  pushUserScore(gameRoom: GameRoom, userScoreDto: UserScoreDto);
  setRank(gameRoom: GameRoom);
  calculateRank(gameRoom: GameRoom, userList: UserGameDto[]);
}
