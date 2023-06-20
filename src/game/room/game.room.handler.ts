import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameRoom } from "./game.room";
import { UserGameDto } from "src/auth/user/dto/user.game.dto";
import { GameRoomStatus } from "../utill/game.enum";
import { SongService } from "src/song/song.service";

@Injectable()
export class GameRoomHandler {
  private roomList: Map<GameRoom, Array<UserGameDto>> = new Map();

  constructor(private songService: SongService) {}

  public joinRoom(gameRoom: GameRoom, user: UserGameDto) {
    this.roomList.get(gameRoom)?.push(user);
  }

  public leaveRoom(gameRoom: GameRoom, user: Socket) {
    const users: UserGameDto[] | undefined = this.roomList
      .get(gameRoom)
      ?.filter((userInfo) => userInfo.getSocket().id !== user.id);
    if (users === undefined) {
      throw new Error("User not found in the game room");
    }
    this.roomList.set(gameRoom, users);
  }

  public isGameRoomReady(gameRoom: GameRoom): boolean {
    if (gameRoom.getAcceptCount() === 3) {
      return true;
    }
    return false;
  }

  public increaseAcceptCount(user: Socket) {
    const gameRoom: GameRoom = this.findRoomBySocket(user);
    gameRoom.increaseAcceptCount();
  }

  public findUsersInRoom(gameRoom: GameRoom): UserGameDto[] {
    const users = this.roomList.get(gameRoom)?.slice();
    if (users === undefined) {
      throw new Error("User not found in the game room");
    }
    return users;
  }

  public async createRoom(): Promise<GameRoom> {
    const gameSongDto = await this.songService.getRandomSong();
    const gameRoom: GameRoom = new GameRoom(
      this.roomCount() + 1,
      GameRoomStatus.MATCHING,
      0,
      gameSongDto
    );
    this.roomList.set(gameRoom, []);
    return gameRoom;
  }

  public deleteRoom(user: Socket) {
    const gameRoom: GameRoom = this.findRoomBySocket(user);
    this.roomList.delete(gameRoom);
  }

  public findRoomBySocket(user: Socket): GameRoom {
    for (const key of this.roomList.keys()) {
      const foundUser: UserGameDto | undefined = this.roomList
        .get(key)
        ?.find((userInRoom) => userInRoom.getSocket() === user);
      if (foundUser !== undefined) {
        return key;
      }
    }
    throw new Error("Room not found");
  }

  public findRoomByUserId(userId: string): GameRoom {
    for (const key of this.roomList.keys()) {
      const foundUser: UserGameDto | undefined = this.roomList
        .get(key)
        ?.find((userInRoom) => userInRoom.getUserMatchDto().userId === userId);
      if (foundUser !== undefined) {
        return key;
      }
    }
    throw new Error("Room not found");
  }
  private roomCount(): number {
    return this.roomList.size;
  }
}
