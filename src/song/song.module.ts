import { Module } from "@nestjs/common";
import { SongService } from "./song.service";
import { Song } from "./entities/song.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SongResolver } from "./song.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [],
  providers: [SongService, SongResolver],
  exports: [SongService],
})
export class SongModule {}
