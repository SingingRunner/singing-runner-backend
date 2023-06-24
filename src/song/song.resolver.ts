import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { SongService } from "src/song/song.service";
import { GameSongDto } from "./dto/game-song.dto";

@Resolver()
export class SongResolver {
  constructor(private songService: SongService) {}

  @Query(() => [GameSongDto])
  async searchSong(
    @Args("keyword") keyword: string,
    @Args("page", { type: () => Int }) page: number,
    @Args("filter") filter: string
  ): Promise<GameSongDto[]> {
    return await this.songService.searchSong(keyword, page, filter);
  }
}
