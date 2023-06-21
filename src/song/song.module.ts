import { Module } from "@nestjs/common";
import { SongService } from "./song.service";
import { Song } from "./entities/song.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}
