import { AcceptDataDto } from "./match/dto/accept-data.dto";
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
import { UserActiveStatus } from "src/user/util/user.enum";
import { GameReplayService } from "./replay/game.replay.service";
import { CustomSongDto } from "./util/custom-song.dto";
import { CustomUserInfoDto } from "./util/custom-user.info.dto";
import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { HeartBeat } from "src/social/heartbeat/heartbeat";
import { GameRoomStatus, Message } from "./util/game.enum";
import { MatchInfoDto } from "./match/dto/match-info.dto";

/**
 * webSocket 통신을 담당하는 Handler
 */

@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new ConsoleLogger(GameGateway.name);
  private missedQueue: any[] = [];

  constructor(
    private matchService: MatchService,
    private gameService: GameService,
    private customModeService: CustomModeService,
    private gameReplayService: GameReplayService,
    @Inject("HeartBeat")
    private heartBeat: HeartBeat
  ) {}

  afterInit(server: any) {
    console.log(server);
  }

  handleConnection(@ConnectedSocket() user: Socket) {
    this.logger.log(`connected : ${user.id}`);

    let { userId } = user.handshake.query;
    if (userId === undefined) {
      return;
    }
    if (Array.isArray(userId)) {
      userId = userId.join("");
    }

    for (const missed of this.missedQueue) {
      if (missed.userId === userId) {
        this.sendEventToUser(missed.userId, user, {
          message: missed.message,
          responseData: missed.responseData,
        });
      }
    }
    this.missedQueue = this.missedQueue.filter(
      (missed) => missed.userId !== userId
    );

    this.heartBeat.setHeartBeatMap(userId, Date.now());
    this.matchService.updateUserSocket(userId, user);
  }

  handleDisconnect(@ConnectedSocket() user: Socket) {
    this.logger.log(`disconnected : ${user.id}`);
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
  @SubscribeMessage(Message.MATCH_MAKING)
  async matchMakingData(
    @ConnectedSocket() user: Socket,
    @MessageBody() matchInfoDto: MatchInfoDto
  ) {
    if (!(await this.matchService.handleMatchRequest(user, matchInfoDto))) {
      return;
    }

    this.broadCast(
      user,
      matchInfoDto.userMatchDto.userId,
      Message.MATCH_MAKING,
      this.matchService.getSongInfo(matchInfoDto.userMatchDto.userId)
    );
  }

  /**
   * 같은 Room user가 전부 accpet시 게임시작
   * 한명이라도 거절시 Room 제거, 수락한 user는 readyQueue 에 우선순위가 높게 push
   */
  @SubscribeMessage(Message.ACCEPT)
  matchAcceptData(
    @ConnectedSocket() user: Socket,
    @MessageBody() acceptDataDto: AcceptDataDto
  ) {
    //
    if (acceptDataDto.accept) {
      if (!this.matchService.acceptAllUsers(acceptDataDto.userId)) {
        return;
      }
      this.broadCast(user, acceptDataDto.userId, Message.ACCEPT, true);
    }

    this.gameService.updateUserActive(
      acceptDataDto.userId,
      UserActiveStatus.CONNECT
    );
    this.matchService.matchDeny(acceptDataDto.userId);
    this.broadCast(user, acceptDataDto.userId, Message.ACCEPT, false);
    this.matchService.deleteRoom(acceptDataDto.userId);
    return;
  }

  @SubscribeMessage(Message.LOADING)
  loadSongData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    const loadData = this.gameService.loadData(data.userId);
    user.emit(Message.LOADING, loadData);
  }

  @SubscribeMessage(Message.GAME_READY)
  gameReadyData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    this.heartBeat.setHeartBeatMap(data.userId, Date.now());
    try {
      if (this.gameService.isGameReady(data.userId)) {
        const userIdList: string[] = this.gameService.findUsersIdInSameRoom(
          data.userId
        );
        for (const userId of userIdList) {
          this.gameService.updateUserActive(userId, UserActiveStatus.IN_GAME);
        }
        this.broadCast(user, data.userId, Message.GAME_READY, userIdList);
      }
    } catch (error) {
      throw new HttpException(
        "game_ready 실패",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @SubscribeMessage(Message.USE_ITEM)
  useItemData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    this.broadCast(user, data.userId, Message.USE_ITEM, data);
  }

  @SubscribeMessage(Message.GET_ITEM)
  getItemData(@ConnectedSocket() user: Socket, @MessageBody() userId: string) {
    const item = this.gameService.getItem(userId);
    user.emit(Message.GET_ITEM, item);
  }

  @SubscribeMessage(Message.GAME_MODE)
  gameMode(@ConnectedSocket() user: Socket, @MessageBody() data) {
    const gameRoom: GameRoom = this.matchService.findRoomByUserId(data.userId);
    gameRoom.setGameMode(
      gameRoom.getGameMode() === "아이템" ? "일반" : "아이템"
    );
    this.broadCast(user, data.userId, Message.GAME_MODE, data.gameMode);
  }

  @SubscribeMessage(Message.ESCAPE_ITEM)
  escapeFrozenData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    this.broadCast(user, data.userId, Message.ESCAPE_ITEM, data);
  }

  @SubscribeMessage(Message.SCORE)
  scoreData(
    @ConnectedSocket() user: Socket,
    @MessageBody() userScoreDto: UserScoreDto
  ) {
    this.broadCast(user, userScoreDto.userId, Message.SCORE, userScoreDto);
  }

  @SubscribeMessage(Message.GAME_TERMINATED)
  async gameTerminated(
    @ConnectedSocket() user: Socket,
    @MessageBody() userScoreDto: UserScoreDto
  ) {
    this.heartBeat.setHeartBeatMap(userScoreDto.userId, Date.now());
    try {
      if (!this.gameService.allUsersTerminated(userScoreDto)) {
        return;
      }
      this.gameService.resetItem();
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
          UserActiveStatus.CONNECT
        );
        for (const gameTerminated of gameTerminatedList) {
          await this.gameService.setGameTerminatedDto(userGame, gameTerminated);
        }
        this.gameService.putEvent(
          gameRoom,
          Message.GAME_TERMINATED,
          JSON.stringify(gameTerminatedList),
          user
        );
        this.sendEventToUser(
          userGame.getUserMatchDto().userId,
          userGame.getSocket(),
          { message: Message.GAME_TERMINATED, responseData: gameTerminatedList }
        );
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "gameterminiated",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @SubscribeMessage(Message.INVITE)
  async accpetInvite(@ConnectedSocket() user: Socket, @MessageBody() data) {
    try {
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
        this.sendEventToUser(
          userGame.getUserMatchDto().userId,
          userGame.getSocket(),
          { message: Message.INVITE, responseData: customUserList }
        );
      }
      return { message: "success", data: customUserList };
    } catch (error) {
      if (error.message === "full") {
        return { message: "full" };
      } else if (error.message === "inGame") {
        return { message: "inGame" };
      }
      throw new HttpException("accpet error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @SubscribeMessage(Message.CREATE_CUSTOM)
  async createCustomRoom(
    @ConnectedSocket() user: Socket,
    @MessageBody() userMatchDto: UserMatchDto
  ) {
    try {
      await this.customModeService.createCustomRoom(user, userMatchDto);
      const gameRoom: GameRoom = this.matchService.findRoomByUserId(
        userMatchDto.userId
      );
      user.emit(Message.CREATE_CUSTOM, gameRoom.getRoomId());
    } catch (error) {
      throw new HttpException(
        "create_custom",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @SubscribeMessage(Message.SET_SONG)
  async setGameSong(@ConnectedSocket() user: Socket, @MessageBody() data) {
    const gameSong: CustomSongDto = await this.customModeService.setCustomSong(
      data.userId,
      data.songId
    );
    this.broadCast(user, data.userId, Message.SET_SONG, gameSong);
  }

  @SubscribeMessage(Message.LEAVE_ROOM)
  async leaveRoom(
    @ConnectedSocket() user: Socket,
    @MessageBody() userId: string
  ) {
    const userMatchDto: UserMatchDto =
      await this.customModeService.getUserMatchDtobyId(userId);
    this.broadCast(user, userId, Message.LEAVE_ROOM, userMatchDto.nickname);
    this.customModeService.leaveRoom(userMatchDto);
    return;
  }

  @SubscribeMessage(Message.CUSTOM_START)
  startCustom(@ConnectedSocket() user: Socket, @MessageBody() data) {
    const gameRoom: GameRoom = this.matchService.findRoomByUserId(data.userId);
    gameRoom.setRoomStatus(GameRoomStatus.IN_GAME);
    this.broadCast(user, data.userId, Message.CUSTOM_START, true);
  }

  @SubscribeMessage(Message.LOAD_REPLAY)
  async loadReplay(
    @ConnectedSocket() user: Socket,
    @MessageBody() replayId: number
  ) {
    const replayData = await this.gameReplayService.loadData(replayId);
    user.emit(Message.LOAD_REPLAY, replayData);
  }

  @SubscribeMessage(Message.START_REPLAY)
  startReplay(@ConnectedSocket() user: Socket, @MessageBody() data) {
    this.gameReplayService.replayGame(user, data[0], data[1]);
  }

  private broadCast(
    userSocket: Socket,
    userId: string,
    message: string,
    responseData: any
  ) {
    try {
      const gameRoom: GameRoom = this.matchService.findRoomByUserId(userId);
      this.gameService.putEvent(gameRoom, message, responseData, userSocket);
      const userList: UserGameDto[] =
        this.matchService.findUsersInSameRoom(gameRoom);
      for (const user of userList) {
        this.sendEventToUser(user.getUserMatchDto().userId, user.getSocket(), {
          message,
          responseData,
        });
      }
    } catch (error) {
      throw new HttpException(
        "broadCastError",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  sendEventToUser(userId: string, user: Socket, event: any) {
    if (user && user.connected) {
      user.emit(event.message, event.responseData);
    } else {
      this.missedQueue.push({
        userId,
        message: event.message,
        responseData: event.responseData,
      });
    }
  }
}
