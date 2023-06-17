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
import { Item } from "./item/item.enum";
import { GameRoom } from "./room/game.room";
import { UserGameDto } from "src/user/dto/user.game.dto";

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
    private gameService: GameService
  ) {}

  afterInit(server: Server) {
    console.log("Socket.io server initialized in ");
  }

  handleConnection(@ConnectedSocket() user: Socket) {
    console.log(`Client connected: ${user.id}`);
  }

  handleDisconnect(@ConnectedSocket() user: Socket) {
    console.log(`Client disconnected: ${user.id}`);
    this.matchService.matchCancel(user);
  }

  /**
   * MatchMakingPolicy에 따라 user가 매칭되면 GameRoom에 추가 후
   * 같이 매칭된 user들(same GameRoom) 과 함께 songTilte, Singer 정보를 전송
   */

  @SubscribeMessage("match_making")
  matchMakingData(@ConnectedSocket() user: Socket, @MessageBody() data) {
    console.log("matchmaking connect");
    const message = "match_making";
    if (data.accept && this.matchService.matchMade(user, data.UserMatchDto)) {
      const gameRoom: GameRoom = this.matchService.findRoomBySocket(user);
      const responseData = this.matchService.getSongInfo(gameRoom);
      this.broadCast(this.matchService.findUsersInSameRoom(gameRoom), message, responseData);      
      return
    }
    this.matchService.matchCancel(user);
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
    const message = "match_making";
    const gameRoom: GameRoom = this.matchService.findRoomBySocket(user);

    if (accept&& this.matchService.acceptAllUsers(user)) {
      this.broadCast(this.matchService.findUsersInSameRoom(gameRoom), message, true);
      return;
    }

    this.matchService.matchDeny(user);
    this.broadCast(this.matchService.findUsersInSameRoom(gameRoom), message, false);
    this.matchService.deleteRoom(user);
  }

  @SubscribeMessage("loading")
  loadSongData(@ConnectedSocket() user: Socket) {
    this.gameService.loadData(user);
  }

  @SubscribeMessage("game_ready")
  gameReadyData(@ConnectedSocket() user: Socket) {
    this.gameService.gameReady(user);
  }

  @SubscribeMessage("use_item")
  useItemData(@ConnectedSocket() user: Socket, @MessageBody() item: Item) {
    this.gameService.useItem(user, item);
  }

  @SubscribeMessage("get_item")
  getItemData(@ConnectedSocket() user: Socket) {
    console.log("get item");
    this.gameService.itemGenerate(user);
  }

  @SubscribeMessage("escape_item")
  escapeFrozenData(@ConnectedSocket() user: Socket) {
    const message = "escape_item";
    console.log("escape item");
    const gameRoom:GameRoom = this.matchService.findRoomBySocket(user);
    this.broadCast(this.matchService.findUsersInSameRoom(gameRoom), message, user.id);
  }

  @SubscribeMessage("score")
  scoreData(@ConnectedSocket() user: Socket, @MessageBody() score: number) {
    this.gameService.broadcastScore(user, score);
  }

  private broadCast(userList: UserGameDto[], message:string, responseData: any){
    for (const user of userList) {
      user.getSocket().emit(message, responseData);
    }
  }
}
