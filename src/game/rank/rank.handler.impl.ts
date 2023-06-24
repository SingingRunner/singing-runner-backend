import { Injectable } from "@nestjs/common";
import { GameRoom } from "../room/game.room";
import { UserScoreDto } from "./dto/user-score.dto";
import { RankHandler } from "./rank.hanlder";
import { GameTerminatedDto } from "./game-terminated.dto";

@Injectable()
export class RankHandlerImpl implements RankHandler {
  private rankMap: Map<GameRoom, UserScoreDto[]> = new Map();

  public getUserScoreDto(gameRoom: GameRoom): UserScoreDto[] {
    const userScoreList = this.rankMap.get(gameRoom);
    if (userScoreList === undefined) {
      throw new Error("UserScore not found in game room");
    }
    return userScoreList;
  }

  public pushUserScore(gameRoom: GameRoom, userScoreDto: UserScoreDto) {
    if (userScoreDto === undefined || userScoreDto == null) {
      throw new Error("user score is undefinde or null");
    }
    this.getUserScoreDto(gameRoom).push(userScoreDto);
  }

  public setRank(gameRoom: GameRoom) {
    this.rankMap.set(gameRoom, []);
  }

  public calculateRank(gameRoom: GameRoom): GameTerminatedDto[] {
    console.log("ranHandler");
    if (gameRoom === undefined || gameRoom === null) {
      throw new Error("game room is undefined or null");
    }
    const userScoreList: UserScoreDto[] | undefined =
      this.rankMap.get(gameRoom);
    if (userScoreList === undefined) {
      throw new Error("game room is undefined or null");
    }
    console.log("userScoreList: ", userScoreList);
    console.log("userScore: ", userScoreList[0]);
    console.log("userScore. score : ", userScoreList[0].score);
    console.log("Type: ", typeof userScoreList);
    console.log("Type: ", typeof userScoreList[0]);
    userScoreList?.sort((a, b) => b.score - a.score);

    const gameTerminatedList: GameTerminatedDto[] = [];
    gameTerminatedList.push(
      new GameTerminatedDto(
        userScoreList[0].userId,
        50,
        userScoreList[0].score
      ),
      new GameTerminatedDto(
        userScoreList[1].userId,
        10,
        userScoreList[1].score
      ),
      new GameTerminatedDto(
        userScoreList[2].userId,
        -10,
        userScoreList[2].score
      )
    );

    return gameTerminatedList;
  }
}
