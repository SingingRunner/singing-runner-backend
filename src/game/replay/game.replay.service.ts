import { Injectable } from "@nestjs/common";
import { SongService } from "src/song/song.service";
import { Repository } from "typeorm";
import { GameReplayEntity } from "./entity/game.replay.entity";
import { Socket } from "socket.io";
import { GameSongDto } from "src/song/dto/game-song.dto";

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

  public async replayGame(user: Socket, replayId: number) {
    const gameEvent: string = await this.gameReplayRepository
      .findOne({
        where: { replayId: replayId },
      })
      .then((gameReplay: GameReplayEntity) => {
        return gameReplay.gameEvent;
      });
    // aws s3 에서 gameEvent 를 가져와서 setTimeout으로 socket emit event 예약
    // fetch 과정이 조금 걸릴 수도 있으니 서버에서 파일 로드가 완료될 때까지 클라이언트 대기하게끔 소켓 이벤트 추가해야할듯
    console.log(gameEvent);
  }
}
