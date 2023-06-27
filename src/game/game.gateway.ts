import { UserMatchDto } from "./../user/dto/user.match.dto";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MatchService } from "./match/match.service";
import { GameService } from "./game.service";
import { GameRoom } from "./room/game.room";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { UserScoreDto } from "./rank/dto/user-score.dto";
import { GameTerminatedDto } from "./rank/game-terminated.dto";
import { CustomModeService } from "./custom-mode/custom.mode.service";
import { userActiveStatus } from "src/user/util/user.enum";
import { GameReplayService } from "./replay/game.replay.service";
import { CustomSongDto } from "./util/custom-song.dto";
import { CustomUserInfoDto } from "./util/custom-user.info.dto";

/**
 * webSocket 통신을 담당하는 Handler
 */
@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private matchService: MatchService,
    private gameService: GameService,
    private customModeService: CustomModeService,
    private gameReplayService: GameReplayService
  ) {}

  afterInit(server: Server) {
    console.log("Socket.io server initialized in ");
    console.log(server);
  }

  handleConnection(@ConnectedSocket() user: Socket) {
    // console.log(`Client connected socketID: ${user.id}`);
    let { userId } = user.handshake.query;
    if (userId === undefined) {
      throw new Error("소켓접속시 userId가 전달되지 않았습니다.");
    }
    if (Array.isArray(userId)) {
      userId = userId.join("");
    }
    console.log("SOCKET CONNECT : ", userId);
    this.matchService.updateUserSocket(userId, user);
  }

  handleDisconnect(@ConnectedSocket() user: Socket) {
    console.log("disconnected");
    try {
      this.matchService.updateUserConnected(user);
    } catch {
      return;
    }
  }

  /**
   * MatchMakingPolicy에 따라 user가 매칭되면 GameRoom에 추가 후
   * 같이 매칭된 user들(same GameRoom) 과 함께 songTitle, Singer 정보를 전송
   */

  @SubscribeMessage("match_making")
  async matchMakingData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    console.log("matchmaking connect");
    const message = "match_making";
    if (!data.accept) {
      this.matchService.matchCancel(data.UserMatchDto.userId);
      return;
    }
    console.log("matchmaking", data.UserMatchDto.nickname);
    if (!(await this.matchService.isMatchMade(user, data.UserMatchDto))) {
      return;
    }
    const gameRoom: GameRoom = this.matchService.findRoomByUserId(
      data.UserMatchDto.userId
    );
    // console.log("gameroom", gameRoom);
    const responseData = this.matchService.getSongInfo(gameRoom);
    this.broadCast(user, data.UserMatchDto.userId, message, responseData);
    return;
  }

  /**
   * 같은 Room user가 전부 accpet시 게임시작
   * 한명이라도 거절시 Room 제거, 수락한 user는 readyQueue 에 우선순위가 높게 push
   */
  @SubscribeMessage("accept")
  matchAcceptData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    const message = "accept";
    console.log("accept!!!!!!!!");
    if (data.accept) {
      if (!this.matchService.acceptAllUsers(data.userId)) {
        return;
      }
      this.broadCast(user, data.userId, message, true);
      return;
    }

    this.matchService.matchDeny(data.userId);
    this.broadCast(user, data.userId, message, false);
    this.matchService.deleteRoom(data.userId);
  }

  @SubscribeMessage("loading")
  loadSongData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    const loadData = this.gameService.loadData(data.userId);
    user.emit("loading", loadData);
  }

  @SubscribeMessage("game_ready")
  gameReadyData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    if (this.gameService.isGameReady(data.userId)) {
      const userIdList: string[] = this.gameService.findUsersIdInSameRoom(
        data.userId
      );
      for (const userId of userIdList) {
        this.gameService.updateUserActive(userId, userActiveStatus.IN_GAME);
      }
      this.broadCast(user, data.userId, "game_ready", userIdList);
    }
  }

  @SubscribeMessage("use_item")
  useItemData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    this.broadCast(user, data.userId, "use_item", data);
  }

  @SubscribeMessage("get_item")
  getItemData(@ConnectedSocket() user: Socket) {
    const item = this.gameService.getItem();
    user.emit("get_item", item);
  }

  @SubscribeMessage("escape_item")
  escapeFrozenData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    const message = "escape_item";
    this.broadCast(user, data.userId, message, data);
  }

  @SubscribeMessage("score")
  scoreData(
    @ConnectedSocket() user: Socket,
    @MessageBody() userScoreDto: UserScoreDto
  ) {
    this.broadCast(user, userScoreDto.userId, "score", userScoreDto);
  }

  @SubscribeMessage("game_terminated")
  async gameTerminated(
    @ConnectedSocket() user: Socket,
    @MessageBody() userScoreDto: UserScoreDto
  ) {
    if (!this.gameService.allUsersTerminated(userScoreDto)) {
      return;
    }

    const gameTerminatedList: GameTerminatedDto[] =
      await this.gameService.calculateRank(userScoreDto.userId);
    const gameRoom: GameRoom = this.matchService.findRoomByUserId(
      userScoreDto.userId
    );
    const userList: UserGameDto[] =
      this.matchService.findUsersInSameRoom(gameRoom);

    for (const gameTerminated of gameTerminatedList) {
      await this.gameService.setGameTerminatedCharacter(gameTerminated);
    }

    for (const userGame of userList) {
      await this.gameService.updateUserActive(
        userGame.getUserMatchDto().userId,
        userActiveStatus.CONNECT
      );
      for (const gameTerminated of gameTerminatedList) {
        await this.gameService.setGameTerminatedDto(userGame, gameTerminated);
      }
      this.gameService.putEvent(
        gameRoom,
        "game_terminated",
        JSON.stringify(gameTerminatedList),
        user
      );
      userGame.getSocket().emit("game_terminated", gameTerminatedList);
    }
  }

  @SubscribeMessage("invite")
  async accpetInvite(@ConnectedSocket() user: Socket, @MessageBody() data) {
    await this.customModeService.acceptInvite(
      user,
      data.userId,
      data.HostUserDto
    );
    const customUserList: CustomUserInfoDto[] =
      this.customModeService.setCustomUserInfo(user);
    const gameRoom: GameRoom = this.matchService.findRoomBySocket(user);
    const userList: UserGameDto[] =
      this.matchService.findUsersInSameRoom(gameRoom);

    for (const userGame of userList) {
      for (const customUser of customUserList) {
        await this.customModeService.checkFriend(userGame, customUser);
      }
      userGame.getSocket().emit("invite", customUserList);
    }
  }

  @SubscribeMessage("create_custom")
  async createCustomRoom(
    @ConnectedSocket() user: Socket,
    @MessageBody() userMatchDto: UserMatchDto
  ) {
    await this.customModeService.createCustomRoom(user, userMatchDto);
    const gameRoom: GameRoom = this.matchService.findRoomByUserId(
      userMatchDto.userId
    );
    user.emit("create_custom", gameRoom.getRoomId());
  }

  @SubscribeMessage("set_song")
  async setGameSong(@ConnectedSocket() user: Socket, @MessageBody() data) {
    const gameSong: CustomSongDto = await this.customModeService.setCustomSong(
      data.userId,
      data.songId
    );
    this.broadCast(user, data.userId, "set_song", gameSong);
  }

  @SubscribeMessage("leave_room")
  async leaveRoom(
    @ConnectedSocket() user: Socket,
    @MessageBody() userId: string
  ) {
    const userMatchDto: UserMatchDto =
      await this.customModeService.getUserMatchDtobyId(userId);
    this.broadCast(user, userId, "leave_room", userMatchDto.nickname);
    this.customModeService.leaveRoom(userMatchDto);
  }

  @SubscribeMessage("custom_start")
  startCustom(@ConnectedSocket() user: Socket, @MessageBody() data) {
    this.broadCast(user, data.userId, "custom_start", true);
  }

  @SubscribeMessage("load_replay")
  async loadReplay(
    @ConnectedSocket() user: Socket,
    @MessageBody() replayId: number
  ) {
    const replayData = await this.gameReplayService.loadData(replayId);
    user.emit("load_replay", replayData);
  }

  @SubscribeMessage("start_replay")
  startReplay(@ConnectedSocket() user: Socket, @MessageBody() data) {
    this.gameReplayService.replayGame(user, data[0], data[1]);
  }

  private broadCast(
    userSocket: Socket,
    userId: string,
    message: string,
    responseData: any
  ) {
    const gameRoom: GameRoom = this.matchService.findRoomByUserId(userId);
    this.gameService.putEvent(gameRoom, message, responseData, userSocket);
    const userList: UserGameDto[] =
      this.matchService.findUsersInSameRoom(gameRoom);
    for (const user of userList) {
      user.getSocket().emit(message, responseData);
    }
  }
}
