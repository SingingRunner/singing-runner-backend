import { Module } from "@nestjs/common";
import { GameService } from "./game.service";
// import { SimpleMatchMaking } from "./match/simple.match.making";
import { GameRoomHandler } from "./room/game.room.handler";
import { GameGateway } from "./game.gateway";
import { MatchService } from "./match/match.service";
import { SongModule } from "src/song/song.module";
import { MMRMatchPolicy } from "./match/mmr.match.policy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameReplayEntity } from "./replay/entity/game.replay.entity";
import { RankHandlerImpl } from "./rank/rank.handler.impl";
import { GameReplayService } from "./replay/game.replay.service";
import { GameResolver } from "./game.resolver";
import { User } from "src/user/entity/user.entity";
import { CustomModeService } from "./custom-mode/custom.mode.service";
import { UserModule } from "src/user/user.module";
import { SocialModule } from "src/social/social.module";
import { SocketValidator } from "./room/socket.validator";
import { TimeoutManager } from "./timeout/timeout";
import { RandomItemPolicy } from "./item/random.item.policy";

@Module({
  imports: [
    UserModule,
    SongModule,
    TypeOrmModule.forFeature([GameReplayEntity, User]),
    SocialModule,
  ],
  providers: [
    GameService,
    MatchService,
    GameReplayService,
    GameRoomHandler,
    CustomModeService,
    {
      provide: "MatchMakingPolicy",
      useClass: MMRMatchPolicy,
    },
    GameGateway,
    {
      provide: "ItemPolicy",
      useClass: RandomItemPolicy,
    },
    {
      provide: "RankHandler",
      useClass: RankHandlerImpl,
    },
    SocketValidator,
    GameResolver,
    SocialModule,
    TimeoutManager,
  ],
  exports: [GameReplayService],
})
export class GameModule {}
