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

@WebSocketGateway()
export class EventsGateway
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
    if (this.gameService.isMatchingAvailable(userGameDto)) {
      const userList: Array<UserGameDto> =
        this.gameService.findUsersInSameRoom(user);

      for (const user of userList) {
        user.socket.emit('match_making', true);
      }
    }
  }
}
