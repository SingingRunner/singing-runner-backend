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
import { UserItemDto } from "./item/dto/user-item.dto";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { UserScoreDto } from "./rank/dto/user-score.dto";
import { GameTerminatedDto } from "./rank/game-terminated.dto";
import { CustomModeService } from "./custom-mode/custom.mode.service";
import { GameSongDto } from "src/song/dto/game-song.dto";
import { userActiveStatus } from "src/user/util/user.enum";
import { UserInfoDto } from "./utill/user-info.dto";

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
    private customModeService: CustomModeService
  ) {}

  afterInit(server: Server) {
    console.log("Socket.io server initialized in ");
    console.log(server);
  }

  handleConnection(@ConnectedSocket() user: Socket) {
    console.log(`Client connected: ${user.id}`);
  }

  handleDisconnect(@ConnectedSocket() user: Socket) {
    // 게임중일떄 disconnect 시 탈주자처리
    console.log(`Client disconnected: ${user.id}`);

    if (!this.gameService.exitWhileInGame(user)) {
      this.matchService.matchCancel(user);
      return;
    }

    const userSocketList: Socket[] | undefined =
      this.gameService.findUsersSocketInSameRoom(user);
    const exitUserInfo: UserInfoDto | undefined =
      this.gameService.getUserInfoBySocket(user);

    for (const userSocket of userSocketList) {
      if (userSocket === user) {
        continue;
      }
      userSocket.emit("exit", exitUserInfo);
    }
    this.gameService.leaveRoom(user);
  }

  /**
   * MatchMakingPolicy에 따라 user가 매칭되면 GameRoom에 추가 후
   * 같이 매칭된 user들(same GameRoom) 과 함께 songTilte, Singer 정보를 전송
   */

  @SubscribeMessage("match_making")
  async matchMakingData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    console.log("matchmaking connect");
    const message = "match_making";
    console.log("matchMaking", data);
    if (!data.accept) {
      this.matchService.matchCancel(user);
      return;
    }
    if (!(await this.matchService.isMatchMade(user, data.UserMatchDto))) {
      return;
    }
    const gameRoom: GameRoom = this.matchService.findRoomBySocket(user);
    const responseData = this.matchService.getSongInfo(gameRoom);
    this.broadCast(user, message, responseData);
    return;
  }

  /**
   * 같은 Room user가 전부 accpet시 게임시작
   * 한명이라도 거절시 Room 제거, 수락한 user는 readyQueue 에 우선순위가 높게 push
   */
  @SubscribeMessage("accept")
  matchAcceptData(
    @ConnectedSocket() user: Socket,
    @MessageBody() accept: boolean
  ) {
    const message = "accept";

    if (accept) {
      if (!this.matchService.acceptAllUsers(user)) {
        return;
      }
      this.broadCast(user, message, true);
      return;
    }

    this.matchService.matchDeny(user);
    this.broadCast(user, message, false);
    this.matchService.deleteRoom(user);
  }

  @SubscribeMessage("loading")
  loadSongData(@ConnectedSocket() user: Socket) {
    const data = this.gameService.loadData(user);
    user.emit("loading", data);
  }

  @SubscribeMessage("game_ready")
  gameReadyData(@ConnectedSocket() user: Socket) {
    if (this.gameService.isGameReady(user)) {
      const userIdList: string[] = this.gameService.findUsersIdInSameRoom(user);
      for (const userId of userIdList) {
        this.gameService.updateUserActive(userId, userActiveStatus.IN_GAME);
      }
      this.broadCast(user, "game_ready", userIdList);
    }
  }

  @SubscribeMessage("use_item")
  useItemData(
    @ConnectedSocket() user: Socket,
    @MessageBody() useItem: UserItemDto
  ) {
    console.log("use_item : ", useItem);

    this.broadCast(user, "use_item", useItem);
  }

  @SubscribeMessage("get_item")
  getItemData(@ConnectedSocket() user: Socket) {
    console.log("get item");
    const item = this.gameService.getItem();
    user.emit("get_item", item);
  }

  @SubscribeMessage("escape_item")
  escapeFrozenData(
    @ConnectedSocket() user: Socket,
    @MessageBody() escapeItem: UserItemDto
  ) {
    const message = "escape_item";
    console.log("escape item");
    this.broadCast(user, message, escapeItem);
  }

  @SubscribeMessage("score")
  scoreData(
    @ConnectedSocket() user: Socket,
    @MessageBody() userScoreDto: UserScoreDto
  ) {
    this.broadCast(user, "score", userScoreDto);
  }

  @SubscribeMessage("game_terminated")
  async gameTermintated(
    @ConnectedSocket() user: Socket,
    @MessageBody() userScoreDto: UserScoreDto
  ) {
    if (!this.gameService.allUsersTerminated(user, userScoreDto)) {
      return;
    }

    const gameTermintaedList: GameTerminatedDto[] =
      this.gameService.calculateRank(user);

    for (const gameTerminatedDto of gameTermintaedList) {
      this.gameService.setGameTerminatedDto(user, gameTerminatedDto);
      gameTerminatedDto.getSocket().emit("game_terminated", gameTermintaedList);
    }
  }

  @SubscribeMessage("invite")
  accpetInvite(@ConnectedSocket() user: Socket, @MessageBody() data) {
    this.customModeService.acceptInvite(
      user,
      data.userMatchDto,
      data.HostUserDto
    );
    const userList: UserGameDto[] =
      this.customModeService.findUsersInSameRoom(user);
    this.broadCast(user, "invite", userList);
  }

  @SubscribeMessage("create_custom")
  createCustomRoom(
    @ConnectedSocket() user: Socket,
    @MessageBody() userMatchDto: UserMatchDto
  ) {
    this.customModeService.createCustomRoom(user, userMatchDto);
  }

  @SubscribeMessage("set_song")
  setGameSong(
    @ConnectedSocket() user: Socket,
    @MessageBody() gameSongDto: GameSongDto
  ) {
    this.customModeService.setGameSong(user, gameSongDto);
    this.broadCast(user, "set_song", gameSongDto);
  }

  @SubscribeMessage("leave_room")
  leaveRoom(
    @ConnectedSocket() user: Socket,
    @MessageBody() userMatchDto: UserMatchDto
  ) {
    this.broadCast(user, "leave_room", userMatchDto.nickname);
    this.customModeService.leaveRoom(user, userMatchDto);
  }

  @SubscribeMessage("custom_start")
  startCustom(@ConnectedSocket() user: Socket) {
    this.broadCast(user, "custom_start", true);
  }

  @SubscribeMessage("load_replay")
  async loadReplay(
    @ConnectedSocket() user: Socket,
    @MessageBody() replayId: number
  ) {
    const replayData = await this.gameReplayService.loadData(replayId);
    user.emit("load_replay", replayData);
  }

  private broadCast(user: Socket, message: string, responseData: any) {
    console.log("in broad cast : ", responseData);
    const gameRoom: GameRoom = this.matchService.findRoomBySocket(user);
    this.gameService.putEvent(gameRoom, message, responseData, user);
    const userList: UserGameDto[] =
      this.matchService.findUsersInSameRoom(gameRoom);
    for (const user of userList) {
      user.getSocket().emit(message, responseData);
    }
  }
}
