import { UserMatchDto } from './../user/dto/user.match.dto';
import { UserGameDto } from 'src/user/dto/user.game.dto';
import { UserGameDto } from './../user/dto/user.game.dto';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { find } from 'rxjs';
import { subscribe } from 'diagnostics_channel';
/**
 * webSocket 통신을 담당하는 Handler
 */
@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private gameService: GameService) {}

  afterInit(server: Server) {
    console.log('Socket.io server initialized in ');
  }

  handleConnection(@ConnectedSocket() user: Socket) {
    console.log(`Client connected: ${user.id}`);
  }

  handleDisconnect(@ConnectedSocket() user: Socket) {
    console.log(`Client disconnected: ${user.id}`);
  }

  @SubscribeMessage('match_making')
  matchMakingData(@ConnectedSocket() user: Socket, UserMatchDto: UserMatchDto) {
    /**
     * MatchMakingPolicy에 따라 user가 매칭되면 GameRoom에 추가 후
     * 같이 매칭된 user들(same GameRoom) 과 함께 songTilte, Singer 정보를 전송
     */
    this.gameService.matchMaking(user, UserMatchDto);
  }

  @SubscribeMessage('accept')
  matchAcceptData(@ConnectedSocket() user: Socket, accept: boolean) {
    /**
     * 같은 Room user가 전부 accpet시 게임시작
     * 한명이라도 거절시 Room 제거, 수락한 user는 readyQueue 에 다시 push
     */
  }
}
