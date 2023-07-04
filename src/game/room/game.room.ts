import { GameSongDto } from "src/song/dto/game-song.dto";
import { GameRoomStatus } from "../util/game.enum";
import { GameEventDto } from "../event/dto/game.event.dto";
import { MatchCompleteSongDto } from "src/song/dto/match-complete-song.dto";

export class GameRoom {
  private roomId: number;
  private gameRoomStatus: GameRoomStatus;
  private acceptCount: number;
  private gameSongDto: GameSongDto;
  private roomMaster: string;
  private songListInCustom: GameSongDto[];
  private gameEventList: string[];
  private startTime: number;
  private gameMode: string;
  private isSetSong: boolean;

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
    this.gameEventList = [];
  }

  public getRoomId(): number {
    return this.roomId;
  }

  public getRoomStatus(): GameRoomStatus {
    return this.gameRoomStatus;
  }

  public setRoomStatus(gameRoomStatus: GameRoomStatus) {
    this.gameRoomStatus = gameRoomStatus;
  }

  public getAcceptCount(): number {
    return this.acceptCount;
  }

  public getGameSongDto(): GameSongDto {
    return this.gameSongDto;
  }

  public getMatchSong(): MatchCompleteSongDto {
    return this.gameSongDto.getMatchSong();
  }

  public setGameSongDto(song: GameSongDto) {
    this.gameSongDto = song;
  }

  public increaseAcceptCount() {
    this.acceptCount += 1;
  }

  public resetAcceptCount() {
    this.acceptCount = 0;
  }

  public setRoomMaster(userId: string) {
    this.roomMaster = userId;
  }

  public getRoomMaster() {
    return this.roomMaster;
  }

  public setSongListInCustom(gameSongDtoList: GameSongDto[]) {
    this.songListInCustom = gameSongDtoList;
  }

  public getSongListinCustom(): GameSongDto[] {
    return this.songListInCustom;
  }

  public setStartTime(startTime: number) {
    this.startTime = startTime;
  }

  public getStartTime(): number {
    return this.startTime;
  }

  public putGameEvent(gameEventDto: GameEventDto) {
    this.gameEventList.push(JSON.stringify(gameEventDto));
  }

  public getGameEvent(): string[] {
    return this.gameEventList;
  }

  public getIsSetSong(): boolean {
    return this.isSetSong;
  }

  public setIsSetSong(isSetSong: boolean) {
    this.isSetSong = isSetSong;
  }

  public getGameMode(): string {
    return this.gameMode;
  }

  public setGameMode(gameMode: string) {
    this.gameMode = gameMode;
  }
}
