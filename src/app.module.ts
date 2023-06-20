import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GameModule } from "./game/game.module";
import { SongModule } from "./song/song.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeORMConfig } from "./TypeORMConfig";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeORMConfig),
    GameModule,
    SongModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
