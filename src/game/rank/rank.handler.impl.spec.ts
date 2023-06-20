import { RankHandlerImpl } from "./rank.handler.impl";
import { GameRoom } from "../room/game.room";
import { UserScoreDto } from "./dto/user-score.dto";
import { GameTerminatedDto } from "./game-terminated.dto";
import { GameRoomStatus } from "../utill/game.enum";
import { GameSongDto } from "src/song/dto/game-song.dto";

describe("RankHandlerImpl", () => {
  let rankHandler: RankHandlerImpl;
  let gameRoom: GameRoom;
  let gameSongDto: GameSongDto;
  beforeEach(() => {
    gameRoom = new GameRoom(1, GameRoomStatus.IN_GAME, 0, gameSongDto); // Create an instance of GameRoom as needed
    rankHandler = new RankHandlerImpl();
  });

  describe("getUserScoreDto", () => {
    it("should return user score list for a given game room", () => {
      // Set up
      const userScoreDto1 = new UserScoreDto("test1", 90);
      const userScoreDto2 = new UserScoreDto("test2", 88);
      rankHandler.setRank(gameRoom);
      rankHandler.pushUserScore(gameRoom, userScoreDto1);
      rankHandler.pushUserScore(gameRoom, userScoreDto2);

      // Act
      const result = rankHandler.getUserScoreDto(gameRoom);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(userScoreDto1);
      expect(result).toContainEqual(userScoreDto2);
    });

    it("should throw an error if user score list is not found for a given game room", () => {
      // Assert
      expect(() => {
        rankHandler.getUserScoreDto(gameRoom);
      }).toThrowError("UserScore not found in game room");
    });
  });

  describe("pushUserScore", () => {
    it("should push a user score to the user score list of a game room", () => {
      // Set up
      const userScoreDto = new UserScoreDto("test1", 90);
      rankHandler.setRank(gameRoom);

      // Act
      rankHandler.pushUserScore(gameRoom, userScoreDto);

      // Assert
      const result = rankHandler.getUserScoreDto(gameRoom);
      expect(result).toContainEqual(userScoreDto);
    });

    describe("setRank", () => {
      it("should set an empty user score list for a game room", () => {
        // Act
        rankHandler.setRank(gameRoom);

        // Assert
        const result = rankHandler.getUserScoreDto(gameRoom);
        expect(result).toHaveLength(0);
      });
    });

    describe("calculateRank", () => {
      it("should calculate the rank based on the user scores of a game room", () => {
        // Set up
        const userScoreDto1 = new UserScoreDto("test1", 90);
        const userScoreDto2 = new UserScoreDto("test2", 33);
        const userScoreDto3 = new UserScoreDto("test3", 50);
        rankHandler.setRank(gameRoom);
        rankHandler.pushUserScore(gameRoom, userScoreDto1);
        rankHandler.pushUserScore(gameRoom, userScoreDto2);
        rankHandler.pushUserScore(gameRoom, userScoreDto3);

        // Act
        const result = rankHandler.calculateRank(gameRoom);

        // Assert
        expect(result).toHaveLength(3);
        expect(result[0]).toBeInstanceOf(GameTerminatedDto);
        expect(result[0].userId).toBe(userScoreDto1.getUserId());
        expect(result[1].userId).toBe(userScoreDto3.getUserId());
        expect(result[2].userId).toBe(userScoreDto2.getUserId());
        // Add more assertions based on your specific implementation and requirements
      });
    });
  });
});
