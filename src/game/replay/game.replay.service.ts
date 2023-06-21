import { Injectable } from "@nestjs/common";
import { SongService } from "src/song/song.service";
import { Repository } from "typeorm";
import { GameReplayEntity } from "./entity/game.replay.entity";
import { Socket } from "socket.io";
import { GameSongDto } from "src/song/dto/game-song.dto";
import { Song } from "src/song/entities/song.entity";

@Injectable()
export class GameReplayService {
  constructor(
    private songService: SongService,
    private gameReplayRepository: Repository<GameReplayEntity>
  ) {}

  public async loadData(user: Socket, replayId: number) {
    const gameReplay: GameReplayEntity | null =
      await this.gameReplayRepository.findOne({
        where: { replayId: replayId },
      });
    if (gameReplay !== null) {
      const gameSongdto: GameSongDto | null =
        await this.songService.getSongById(gameReplay.songId);
      if (gameSongdto !== null) {
        const gameSong = gameSongdto.toJSON();
        const characterList: any = [];
        characterList.push({
          userId: gameReplay.userId,
          character: gameReplay.userCharacter,
        });
        characterList.push({
          userId: gameReplay.player1Id,
          character: gameReplay.player1Character,
        });
        characterList.push({
          userId: gameReplay.player2Id,
          character: gameReplay.player2Character,
        });
        user.emit("replay", {
          gameSong: gameSong,
          characterList: characterList,
        });
      }
    }
  }
}
