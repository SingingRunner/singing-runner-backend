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
  matchMakingData(@ConnectedSocket() user: Socket, userGameDto: UserGameDto) {
    /**
     * MatchMakingPolicy에 따라 user가 매칭되면 같이 매칭된 user들(SameGameRoom)
     * 과 함께 songTilte, Singer 정보를 전송
     */
    if (this.gameService.isMatchingAvailable(userGameDto)) {
      const userList: Array<UserGameDto> =
        this.gameService.findUsersInSameRoom(user);
      for (const user of userList) {
        user.socket.emit('match_making', true); //songTilte, singer DTO를 전송
      }
    }
  }
}
