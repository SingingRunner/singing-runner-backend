import { GameRoom } from "../room/game.room";
import { GameRoomHandler } from "../room/game.room.handler";
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameSongDto } from "src/song/dto/game-song.dto";
import { HostUserDto } from "src/user/dto/host-user.dto";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { UserMatchDto } from "src/user/dto/user.match.dto";

@Injectable()
export class CustomModeService {
  constructor(private gameRoomHandler: GameRoomHandler) {}

  public async createCustomRoom(user: Socket, userMatchDto: UserMatchDto) {
    const userGameDto: UserGameDto = this.createUserGameDto(user, userMatchDto);
    const gameRoom: GameRoom = await this.createRoom();
    this.addUserToRoom(gameRoom, userGameDto);
    this.setRoomMaster(gameRoom, userMatchDto.userId);
  }

  private createUserGameDto(
    user: Socket,
    userMatchDto: UserMatchDto
  ): UserGameDto {
    return new UserGameDto(user, userMatchDto);
  }

  private async createRoom(): Promise<GameRoom> {
    return await this.gameRoomHandler.createRoom();
  }

  private addUserToRoom(gameRoom: GameRoom, userGameDto: UserGameDto): void {
    this.gameRoomHandler.joinRoom(gameRoom, userGameDto);
  }

  private setRoomMaster(gameRoom: GameRoom, userId: string): void {
    gameRoom.setRoomMaster(userId);
  }

  public joinCustomRoom(
    user: Socket,
    userMatchDto: UserMatchDto,
    gameRoom: GameRoom
  ) {
    const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);
    this.addUserToRoom(gameRoom, userGameDto);
  }

  public findRoomByUserId(roomMaster: string): GameRoom {
    return this.gameRoomHandler.findRoomByUserId(roomMaster);
  }

  public acceptInvite(
    user: Socket,
    userMatchDto: UserMatchDto,
    host: HostUserDto
  ) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomByUserId(
      host.getUserId()
    );
    this.joinCustomRoom(user, userMatchDto, gameRoom);
  }

  public findUsersInSameRoom(user: Socket): UserGameDto[] {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    return this.gameRoomHandler.findUsersInRoom(gameRoom);
  }

  public setGameSong(user: Socket, gameSongDto: GameSongDto) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    gameRoom.setGameSongDto(gameSongDto);
  }
}
