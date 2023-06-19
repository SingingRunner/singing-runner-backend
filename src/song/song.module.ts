import { Module } from "@nestjs/common";
import { SongService } from "./song.service";
import { Song } from "./entities/song.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SongRepository } from "./repository/song.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [],
  providers: [SongService, SongRepository],
  exports: [SongService],
})
export class SongModule {}
