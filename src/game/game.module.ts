import { Module } from "@nestjs/common";
import { GameService } from "./game.service";
// import { SimpleMatchMaking } from "./match/simple.match.making";
import { GameRoomHandler } from "./room/game.room.handler";
import { GameGateway } from "./game.gateway";
import { MatchService } from "./match/match.service";
import { SongModule } from "src/song/song.module";
import { SimpleItemPolicy } from "./item/simple.item.policy";
import { MMRMatchPolicy } from "./match/mmr.match.policy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameReplayEntity } from "./replay/entity/game.replay.entity";
import { RankHandlerImpl } from "./rank/rank.handler.impl";
import { GameReplayService } from "./replay/game.replay.service";

@Module({
  imports: [SongModule, TypeOrmModule.forFeature([GameReplayEntity])],
  providers: [
    GameService,
    MatchService,
    GameReplayService,
    GameRoomHandler,
    {
      provide: "MatchMakingPolicy",
      useClass: MMRMatchPolicy,
    },
    GameGateway,
    {
      provide: "ItemPolicy",
      useClass: SimpleItemPolicy,
    },
    {
      provide: "RankHandler",
      useClass: RankHandlerImpl,
    },
  ],
})
export class GameModule {}
