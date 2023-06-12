import { Controller, Get } from '@nestjs/common';
import { SongService } from './song.service';
import { Song } from './entities/song.entity';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get('random')
  async getRandomSong(): Promise<Song> {
    return this.songService.getRandomSong();
  }
}
