import { GameRoom } from "./../room/game.room";

import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

import { GameRoomHandler } from "../room/game.room.handler";
import { MatchMakingPolicy } from "./match.making.policy";
import { UserMatchDto } from "src/user/dto/user.match.dto";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { MatchCompleteSongDto } from "src/song/dto/match-complete-song.dto";

@Injectable()
export class MatchService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject("MatchMakingPolicy")
    private matchMakingPolicy: MatchMakingPolicy
  ) {}

  public async matchMaking(userGameDto): Promise<boolean> {
    const userList: Array<UserGameDto> =
      this.matchMakingPolicy.getAvailableUsers(userGameDto);
    userList.push(userGameDto);
    const gameRoom: GameRoom = await this.gameRoomHandler.createRoom();
    gameRoom.setGameMode("랭크");
    for (const user of userList) {
      this.gameRoomHandler.joinRoom(gameRoom, user);
    }
    return true;
  }

  public async isMatchMade(
    user: Socket,
    userMatchDto: UserMatchDto
  ): Promise<boolean> {
    const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);
    if (this.matchMakingPolicy.isQueueReady(userGameDto)) {
      return await this.matchMaking(userGameDto);
    }
    this.matchMakingPolicy.joinQueue(userGameDto);
    return false;
  }

  public matchCancel(userId: string) {
    this.matchMakingPolicy.leaveQueue(userId);
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
    const gameRoom: GameRoom = this.findRoomByUserId(userId);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    for (const userInfo of userList) {
      this.joinQueueWithOutDenyUser(userInfo, userId);
    }
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

  public getSongInfo(userId: string): MatchCompleteSongDto {
    const gameRoom: GameRoom = this.findRoomByUserId(userId);
    return gameRoom.getMatchSong();
  }

  public deleteRoom(userId: string) {
    this.gameRoomHandler.deleteRoom(userId);
  }

  private joinQueueWithOutDenyUser(userInfo: UserGameDto, userId: string) {
    if (userInfo.getUserMatchDto().userId === userId) {
      return;
    }
    this.matchMakingPolicy.joinQueueAtFront(userInfo);
  }
}
