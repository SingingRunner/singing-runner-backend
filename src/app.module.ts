import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { SongModule } from './song/song.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from './TypeORMConfig';

@Module({
  imports: [TypeOrmModule.forRoot(TypeORMConfig), GameModule, SongModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
