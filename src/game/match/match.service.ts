import { GameRoom } from "./../room/game.room";
import { UserGameDto } from "../../user/dto/user.game.dto";
import { Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { UserMatchDto } from "../../user/dto/user.match.dto";
import { GameRoomHandler } from "../room/game.room.handler";
import { MatchMakingPolicy } from "./match.making.policy";

@Injectable()
export class MatchService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject("MatchMakingPolicy")
    private matchMakingPolicy: MatchMakingPolicy
  ) {}

  public async matchMade(user: Socket, userMatchDto: UserMatchDto) {
    const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);

    if (this.matchMakingPolicy.isQueueReady(userGameDto)) {
      const userList: Array<UserGameDto> =
        this.matchMakingPolicy.getAvailableUsers(userGameDto);
      userList.push(userGameDto);
      const gameRoom: GameRoom = await this.gameRoomHandler.createRoom();
      this.gameRoomHandler.joinRoom(gameRoom, userList);
      return true;
    }
    this.matchMakingPolicy.joinQueue(userGameDto);
    return false
  }

  public matchCancel(user: Socket) {
    this.matchMakingPolicy.leaveQueue(user);
  }

  public acceptAllUsers(user: Socket):boolean {
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
    this.gameRoomHandler.leaveRoom(gameRoom, user);
  }

  public findRoomBySocket(user:Socket):GameRoom{
   return this.gameRoomHandler.findRoomBySocket(user);
  }

  public findUsersInSameRoom(gameRoom: GameRoom): UserGameDto[]{
    return this.gameRoomHandler.findUsersInRoom(gameRoom);
  }

  public getSongInfo(gameRoom:GameRoom){
    const songTitle: string = gameRoom.getGameSongDto().songTitle;
    const singer: string = gameRoom.getGameSongDto().singer;
    return {songTitle, singer} 
  }

  public deleteRoom(user:Socket){
    this.gameRoomHandler.deleteRoom(user);
  }

  private joinQueueWithOutDenyUser(userInfo: UserGameDto, user: Socket) {
    if (userInfo.getSocket().id === user.id) {
      return;
    }
    this.matchMakingPolicy.joinQueueAtFront(userInfo);
  }
}
