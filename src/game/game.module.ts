import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { SimpleMatchMaking } from './match/simple.match.making';
import { GameRoomHandler } from './room/game.room.handler';
import { GameGateway } from './game.gateway';
import { MatchService } from './match/match.service';
import { SongModule } from 'src/song/song.module';

@Module({
  imports: [SongModule],
  providers: [
    GameService,
    MatchService,
    GameRoomHandler,
    {
      provide: 'MatchMakingPolicy',
      useClass: SimpleMatchMaking,
    },
    GameGateway,
  ],
})
export class GameModule {}
