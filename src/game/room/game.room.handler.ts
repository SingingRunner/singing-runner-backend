import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameRoom } from "./game.room";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { GameRoomStatus } from "../util/game.enum";
import { SongService } from "src/song/song.service";

@Injectable()
export class GameRoomHandler {
  private roomList: Map<GameRoom, Array<UserGameDto>> = new Map();
  private userRoomMap: Map<string, GameRoom> = new Map();

  constructor(private songService: SongService) {}

  public joinRoom(gameRoom: GameRoom, user: UserGameDto) {
    const existingRoom: GameRoom | undefined = this.userRoomMap.get(
      user.getUserMatchDto().userId
    );
    if (existingRoom) {
      this.leaveRoom(existingRoom, user.getUserMatchDto().userId);
    }
    this.roomList.get(gameRoom)?.push(user);
    this.userRoomMap.set(user.getUserMatchDto().userId, gameRoom);
  }

  public leaveRoom(gameRoom: GameRoom, userId: string) {
    const users: UserGameDto[] | undefined = this.roomList
      .get(gameRoom)
      ?.filter((userInfo) => userInfo.getUserMatchDto().userId !== userId);
    if (users === undefined) {
      throw new Error("User not found in the game room");
    }
    this.roomList.set(gameRoom, users);
    this.userRoomMap.delete(userId);
    if (this.findUsersInRoom(gameRoom).length === 0) {
      this.roomList.delete(gameRoom);
    }
  }

  public isGameRoomReady(gameRoom: GameRoom): boolean {
    let conectCount = 0;
    const users: UserGameDto[] = this.findUsersInRoom(gameRoom);
    for (const user of users) {
      console.log("is connected status : ", user.getConnected());
      if (user.getConnected()) {
        conectCount++;
      }
    }
    console.log("gameroomreday Count : ", conectCount);
    if (gameRoom.getAcceptCount() === conectCount) {
      return true;
    }
    return false;
  }

  public increaseAcceptCount(userId: string) {
    const gameRoom: GameRoom | undefined = this.findRoomByUserId(userId);
    if (gameRoom === undefined) {
      throw new Error("not found room by userID");
    }
    gameRoom.increaseAcceptCount();
  }

  public findUsersInRoom(gameRoom: GameRoom): UserGameDto[] {
    const users = this.roomList.get(gameRoom);
    if (users === undefined) {
      throw new Error("User not found in the game room");
    }
    return users;
  }
  public updateUserSocket(userId: string, userSocket: Socket) {
    const gameRoom: GameRoom | undefined = this.findRoomByUserId(userId);
    if (gameRoom === undefined) {
      console.log("undefinedROom");
      return;
    }
    const userGameDtoList: UserGameDto[] = this.findUsersInRoom(gameRoom);
    for (const userGameDto of userGameDtoList) {
      if (userGameDto.getUserMatchDto().userId === userId) {
        userGameDto.setSocket(userSocket);
        userGameDto.setConnected(true);
        console.log("set new socket");
      }
    }
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
    console.log("create 이후 현재 roomList : ", this.roomList);
    return gameRoom;
  }

  public deleteRoom(userId: string) {
    const gameRoom: GameRoom | undefined = this.findRoomByUserId(userId);
    if (gameRoom === undefined) {
      throw new Error("not found room by userID");
    }
    const users = this.findUsersInRoom(gameRoom);
    for (const user of users) {
      this.userRoomMap.delete(user.getUserMatchDto().userId);
    }
    this.roomList.delete(gameRoom);
    console.log("delete 이후 현재 roomList : ", this.roomList);
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

  public findRoomByUserId(userId: string): GameRoom | undefined {
    for (const key of this.roomList.keys()) {
      const foundUser: UserGameDto | undefined = this.roomList
        .get(key)
        ?.find((userInRoom) => userInRoom.getUserMatchDto().userId === userId);
      if (foundUser !== undefined) {
        return key;
      }
    }
    return undefined;
  }

  private roomCount(): number {
    return this.roomList.size;
  }
}
