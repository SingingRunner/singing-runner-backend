import { UserActiveStatus } from "src/user/util/user.enum";
import { GameRoom } from "./../room/game.room";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameRoomHandler } from "../room/game.room.handler";
import { MatchMakingPolicy } from "./match.making.policy";
import { UserMatchDto } from "src/user/dto/user.match.dto";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { MatchCompleteSongDto } from "src/song/dto/match-complete-song.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class MatchService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    private userService: UserService,
    @Inject("MatchMakingPolicy")
    private matchMakingPolicy: MatchMakingPolicy
  ) {}

  public async handleMatchRequest(user: Socket, data): Promise<boolean> {
    this.updateUserActive(data.UserMatchDto.userId, UserActiveStatus.IN_GAME);

    if (this.isMatchRejected(data)) {
      this.cancleMatch(data.UserMatchDto.userId);
      this.updateUserActive(data.UserMatchDto.userId, UserActiveStatus.CONNECT);
      return false;
    }

    if (await this.isMatchSuccessful(user, data.UserMatchDto)) {
      return true;
    }

    return false;
  }

  public forcedCacleMatch(gameRoom: GameRoom) {
    try {
      const userList: UserGameDto[] = this.findUsersInSameRoom(gameRoom);
      const filteredUserList = userList.filter(
        (user) => user.getConnected() === true
      );
      filteredUserList.forEach((user) => {
        this.matchMakingPolicy.joinQueue(user);
      });
    } catch (error) {
      console.log(error.Message);
    }
  }

  private isMatchRejected(data): boolean {
    return !data.accept;
  }

  private cancleMatch(userId: string) {
    this.matchMakingPolicy.leaveQueue(userId);
  }

  private async isMatchSuccessful(
    user: Socket,
    userMatchDto: UserMatchDto
  ): Promise<boolean> {
    const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);

    if (this.matchMakingPolicy.isQueueReady(userGameDto)) {
      await this.matchMaking(userGameDto);
      return true;
    }

    this.matchMakingPolicy.joinQueue(userGameDto);
    return false;
  }

  private async matchMaking(userGameDto) {
    const userList: UserGameDto[] =
      this.matchMakingPolicy.getAvailableUsers(userGameDto);
    userList.push(userGameDto);

    const gameRoom: GameRoom = await this.createRankRoom();

    this.joinUsersToGameRoom(gameRoom, userList);
  }

  private async createRankRoom() {
    const gameRoom: GameRoom = await this.gameRoomHandler.createRoom();
    gameRoom.setGameMode("랭크");
    return gameRoom;
  }

  private joinUsersToGameRoom(gameRoom: GameRoom, userList: UserGameDto[]) {
    for (const user of userList) {
      this.gameRoomHandler.joinRoom(gameRoom, user);
    }
  }

  public getSongInfo(userId: string): MatchCompleteSongDto {
    const gameRoom: GameRoom = this.findRoomByUserId(userId);
    return gameRoom.getMatchSong();
  }

  public acceptAllUsers(userId: string): boolean {
    const gameRoom: GameRoom = this.findRoomByUserId(userId);

    this.gameRoomHandler.increaseAcceptCount(userId);

    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      gameRoom.resetAcceptCount();
      return true;
    }
    return false;
  }

  public matchDeny(userId: string) {
    try {
      const gameRoom: GameRoom = this.findRoomByUserId(userId);
      const userList: Array<UserGameDto> =
        this.gameRoomHandler.findUsersInRoom(gameRoom);
      const filteredUserList = userList.filter(
        (user) => user.getConnected() === true
      );
      for (const user of filteredUserList) {
        this.joinQueueWithOutDenyUser(user, userId);
      }
    } catch (error) {
      this.matchMakingPolicy.leaveQueue(userId);
    }
    this.updateUserActive(userId, UserActiveStatus.CONNECT);
  }

  public updateUserConnected(userSocket: Socket) {
    const gameRoom: GameRoom =
      this.gameRoomHandler.findRoomBySocket(userSocket);
    const users: UserGameDto[] = this.gameRoomHandler.findUsersInRoom(gameRoom);
    for (const user of users) {
      if (user.getSocket() === userSocket) {
        user.setConnected(false);
      }
    }
  }

  public findRoomBySocket(user: Socket): GameRoom {
    return this.gameRoomHandler.findRoomBySocket(user);
  }

  public findRoomByUserId(userId: string): GameRoom {
    const gameRoom: GameRoom | undefined =
      this.gameRoomHandler.findRoomByUserId(userId);
    if (gameRoom === undefined) {
      throw new HttpException(
        "can not found room by userId",
        HttpStatus.BAD_REQUEST
      );
    }
    return gameRoom;
  }

  public updateUserSocket(userId: string, userSocket: Socket) {
    this.gameRoomHandler.updateUserSocket(userId, userSocket);
  }

  public findUsersInSameRoom(gameRoom: GameRoom): UserGameDto[] {
    return this.gameRoomHandler.findUsersInRoom(gameRoom);
  }

  public deleteRoom(userId: string) {
    this.gameRoomHandler.deleteRoom(userId);
  }

  private joinQueueWithOutDenyUser(user: UserGameDto, userId: string) {
    if (user.getUserMatchDto().userId === userId) {
      return;
    }
    this.matchMakingPolicy.joinQueueAtFront(user);
  }

  private updateUserActive(userId: string, userActiveStatus: UserActiveStatus) {
    this.userService.updateUserActive(userId, userActiveStatus);
  }
}
