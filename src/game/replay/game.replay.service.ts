import { Injectable } from "@nestjs/common";
import { GameRoomHandler } from "../room/game.room.handler";
import { SongService } from "src/song/song.service";

@Injectable()
export class GameReplayService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    private songService: SongService
  ) {}
}
