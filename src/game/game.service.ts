import { GameRoomHandler } from "./room/game.room.handler";
import { Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameRoom } from "./room/game.room";
import { UserGameDto } from "src/auth/user/dto/user.game.dto";
import { ItemPolicy } from "./item/item.policy";
import { GameSongDto } from "src/song/dto/game-song.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { GameReplayEntity } from "./replay/entity/game.replay.entity";
import { Repository } from "typeorm";
import { CreateReplayInput } from "./replay/dto/create-replay.input";
import { GameEventDto } from "./event/dto/game.event.dto";

@Injectable()
export class GameService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject("ItemPolicy")
    private itemPolicy: ItemPolicy,
    @InjectRepository(GameReplayEntity)
    private gameReplayRepository: Repository<GameReplayEntity>
  ) {}

  public loadData(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: UserGameDto[] =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    const characterList: any = [];
    for (const user of userList) {
      characterList.push({
        userId: user.getUserMatchDto().userId,
        character: user.getUserMatchDto().character,
      });
    }
    const gameSongdto: GameSongDto = gameRoom.getGameSongDto();
    const gameSong = gameSongdto.toJSON();
    user.emit("loading", { gameSong: gameSong, characterList: characterList });
  }

  public isGameReady(user: Socket): boolean {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);

    this.gameRoomHandler.increaseAcceptCount(user);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      gameRoom.setStartTime(new Date().getTime());
      gameRoom.resetAcceptCount();
      return true;
    }
    return false;
  }

  public findUsersIdInSameRoom(user: Socket): string[] {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    const userIdList: string[] = [];
    for (const userInfo of userList) {
      userIdList.push(userInfo.getUserMatchDto().userId);
    }
    return userIdList;
  }

  public getItem() {
    return this.itemPolicy.getItems();
  }

  public async saveReplay(
    gameRoom: GameRoom,
    userId: string,
    userVocal: Blob[]
  ) {
    const songId = gameRoom.getGameSongDto().songId;
    const gameEventBlob = gameRoom.getGameEvent();
    console.log(gameEventBlob);
    const gameReplayEntity: CreateReplayInput = {
      userId: userId,
      songId: songId,
      userVocal: "파일 url",
      gameEvent: "파일 url",
      createdAt: new Date(),
    };
    console.log(userVocal);
    return await this.gameReplayRepository.save(
      this.gameReplayRepository.create(gameReplayEntity)
    );
  }

  public putEvent(
    gameRoom: GameRoom,
    eventName: string,
    eventContent: string,
    user: Socket
  ) {
    const currentTime = new Date().getTime() - gameRoom.getStartTime();
    const gameEvent: GameEventDto = new GameEventDto(
      currentTime,
      user.id,
      eventName,
      eventContent
    );
    gameRoom.putGameEvent(gameEvent);
  }
}
