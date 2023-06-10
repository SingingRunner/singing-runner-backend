import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { SimpleMatchMaking } from './match/simple.match.making';

@Module({
  providers: [
    GameService,
    {
      provide: 'MatchMakingPolicy',
      useClass: SimpleMatchMaking,
    },
  ],
})
export class GameModule {}
