import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { SimpleMatchMaking } from './match/simple.match.making';
import { GameRoomHandler } from './room/game.room.handler';
import { GameGateway } from './game.gateway';
import { MatchService } from './match/match.service';
import { SongModule } from 'src/song/song.module';
import { SimpleItemPolicy } from './item/simple.item.policy';
import { MMRMatchPolicy } from './match/mmr.match.policy';

@Module({
  imports: [SongModule],
  providers: [
    GameService,
    MatchService,
    GameRoomHandler,
    {
      provide: 'MatchMakingPolicy',
      useClass: MMRMatchPolicy,
    },
    GameGateway,
    {
      provide: 'ItemPolicy',
      useClass: SimpleItemPolicy,
    },
  ],
})
export class GameModule {}
