import { Controller, Get } from "@nestjs/common";
import { SongService } from "./song.service";
import { GameSongDto } from "./dto/game-song.dto";

@Controller("song")
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get("random")
  async getRandomSong(): Promise<GameSongDto> {
    const GameSongDto: GameSongDto = await this.songService.getRandomSong();
    return GameSongDto;
  }
}
