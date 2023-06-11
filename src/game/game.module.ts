import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { SimpleMatchMaking } from './match/simple.match.making';
import { GameRoomHandler } from './room/game.room.handler';

@Module({
  providers: [
    GameService,
    GameRoomHandler,
    {
      provide: 'MatchMakingPolicy',
      useClass: SimpleMatchMaking,
    },
  ],
})
export class GameModule {}
