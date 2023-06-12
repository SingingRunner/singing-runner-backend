import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { Song } from './entities/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRepository } from './repository/song.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [SongController],
  providers: [SongService, SongRepository],
})
export class SongModule {}
