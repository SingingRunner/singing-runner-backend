import { GameSongDto } from "src/song/dto/game-song.dto";
import { GameRoomStatus } from "./../utill/game.enum";
import { plainToClass } from "class-transformer";
import { publicDecrypt } from "crypto";
export class GameRoom {
  private roomId: number;
  private gameRoomStatus: GameRoomStatus;
  private acceptCount: number;
  private gameSongDto: GameSongDto;
  private roomMaster: string;
  private songListInCustom: GameSongDto[];
  constructor(
    roomId: number,
    gameRoomStatus: GameRoomStatus,
    acceptCount: number,
    gameSongDto: GameSongDto
  ) {
    this.roomId = roomId;
    this.gameRoomStatus = gameRoomStatus;
    this.acceptCount = acceptCount;
    this.gameSongDto = gameSongDto;
    this.roomMaster = "";
    this.songListInCustom = [];
  }

  public getRoomId(): number {
    return this.roomId;
  }

  public getRoomStatus(): GameRoomStatus {
    return this.gameRoomStatus;
  }

  public getAcceptCount(): number {
    return this.acceptCount;
  }

  public getGameSongDto(): GameSongDto {
    return this.gameSongDto;
  }
  public setGameSongDto(song: GameSongDto){
    this.gameSongDto = song;
  }
  public increaseAcceptCount() {
    this.acceptCount += 1;
  }
  public resetAcceptCount() {
    this.acceptCount = 0;
  }
  public setRoomMaster(userId:string) {
    this.roomMaster = userId;
  }
  public setSongListInCustom(gameSongDtoList: GameSongDto[]){
    this.songListInCustom = gameSongDtoList;
  }

  public getSongListinCustom(): GameSongDto[]{
    return this.songListInCustom;
  }
 
}
