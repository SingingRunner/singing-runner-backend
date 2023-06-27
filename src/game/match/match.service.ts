import { GameRoom } from "./../room/game.room";

import { Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

import { GameRoomHandler } from "../room/game.room.handler";
import { MatchMakingPolicy } from "./match.making.policy";
import { UserMatchDto } from "src/user/dto/user.match.dto";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { error } from "console";

@Injectable()
export class MatchService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject("MatchMakingPolicy")
    private matchMakingPolicy: MatchMakingPolicy
  ) {}

  public async matchMaking(userGameDto) {
    const userList: Array<UserGameDto> =
      this.matchMakingPolicy.getAvailableUsers(userGameDto);
    userList.push(userGameDto);
    const gameRoom: GameRoom = await this.gameRoomHandler.createRoom();
    for (const user of userList) {
      this.gameRoomHandler.joinRoom(gameRoom, user);
    }
  }

  public async isMatchMade(
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

  public matchCancel(userId: string) {
    this.matchMakingPolicy.leaveQueue(userId);
  }

  public acceptAllUsers(user: Socket): boolean {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    this.gameRoomHandler.increaseAcceptCount(user);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      gameRoom.resetAcceptCount();
      return true;
    }
    return false;
  }

  public matchDeny(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    for (const userInfo of userList) {
      this.joinQueueWithOutDenyUser(userInfo, user);
    }
  }

  public findRoomBySocket(user: Socket): GameRoom {
    return this.gameRoomHandler.findRoomBySocket(user);
  }

  public findRoomByUserId(userId: string): GameRoom {
    const gameRoom: GameRoom | undefined =
      this.gameRoomHandler.findRoomByUserId(userId);
    if (gameRoom === undefined) {
      throw new Error("room not found");
    }
    return gameRoom;
  }
  public updateUserSocket(userId: string, userSocket: Socket) {
    this.gameRoomHandler.updateUserSocket(userId, userSocket);
  }
  public findUsersInSameRoom(gameRoom: GameRoom): UserGameDto[] {
    return this.gameRoomHandler.findUsersInRoom(gameRoom);
  }

  public getSongInfo(gameRoom: GameRoom) {
    const songTitle: string = gameRoom.getGameSongDto().songTitle;
    const singer: string = gameRoom.getGameSongDto().singer;
    return { songTitle, singer };
  }

  public deleteRoom(user: Socket) {
    this.gameRoomHandler.deleteRoom(user);
  }

  private joinQueueWithOutDenyUser(userInfo: UserGameDto, user: Socket) {
    if (userInfo.getSocket().id === user.id) {
      return;
    }
    this.matchMakingPolicy.joinQueueAtFront(userInfo);
  }
}
