import { Injectable } from "@nestjs/common";
import { GameRoom } from "../room/game.room";
import { UserScoreDto } from "./dto/user-score.dto";
import { RankHandler } from "./rank.hanlder";
import { GameTerminatedDto } from "./game-terminated.dto";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { GameMode } from "../util/game.enum";

@Injectable()
export class RankHandlerImpl implements RankHandler {
  private rankMap: Map<GameRoom, UserScoreDto[]> = new Map();
  private scoreList = [
    [30, 10, -10],
    [30, 5, 5],
    [15, 15, -10],
    [10, 10, 10],
  ];

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

  public calculateRank(
    gameRoom: GameRoom,
    userList: UserGameDto[]
  ): GameTerminatedDto[] {
    if (gameRoom === undefined || gameRoom === null) {
      throw new Error("game room is undefined or null");
    }
    const userScoreList: UserScoreDto[] | undefined =
      this.getUserScoreDto(gameRoom);

    userScoreList?.sort((a, b) => b.score - a.score);

    const gameTerminatedList: GameTerminatedDto[] = [];
    if (gameRoom.getGameMode() === GameMode.RANK) {
      let tie = 0;
      tie += userScoreList[0].score === userScoreList[1].score ? 2 : 0;
      tie += userScoreList[1].score === userScoreList[2].score ? 1 : 0;
      const score = this.scoreList[tie];
      userScoreList.forEach((userScore, idx) => {
        gameTerminatedList.push(
          new GameTerminatedDto(userScore.userId, score[idx], userScore.score)
        );
      });
    } else {
      for (const userScore of userScoreList) {
        gameTerminatedList.push(
          new GameTerminatedDto(userScore.userId, 0, userScore.score)
        );
      }
    }

    if (userScoreList.length === 3) {
      return gameTerminatedList;
    }

    const userIdsToExclude = new Set(
      userScoreList.map((userScore) => userScore.userId)
    );

    const filteredUserList = userList.filter(
      (user) => !userIdsToExclude.has(user.getUserMatchDto().userId)
    );

    for (const filterUser of filteredUserList) {
      gameTerminatedList.push(
        new GameTerminatedDto(filterUser.getUserMatchDto().userId, -30, 0)
      );
    }
    return gameTerminatedList;
  }
}
