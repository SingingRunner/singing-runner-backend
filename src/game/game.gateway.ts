import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer() server: Server;
  
  constructor(
    
  ) {}

  afterInit(server: Server) {
    console.log('Socket.io server initialized in ');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('match_connected')
  matchConnectedData(@ConnectedSocket() client: Socket, message: string) {
    
  }

  @SubscribeMessage('accept')
  acceptData(@ConnectedSocket() client: Socket, message: string) {
    
  }

  @SubscribeMessage('match_made')
  matchMadeData(@ConnectedSocket() client: Socket, message: string) {
    
  }
  
  @SubscribeMessage('game_start')
  gameStartData(@ConnectedSocket() client: Socket, message: string) {
    
  }
}