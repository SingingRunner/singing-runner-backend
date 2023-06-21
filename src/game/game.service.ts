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
import { UserScoreDto } from "./rank/dto/user-score.dto";
import { RankHandler } from "./rank/rank.hanlder";
import { GameTerminatedDto } from "./rank/game-terminated.dto";

@Injectable()
export class GameService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject("ItemPolicy")
    private itemPolicy: ItemPolicy,
    @InjectRepository(GameReplayEntity)
    private gameReplayRepository: Repository<GameReplayEntity>
    @Inject("RankHandler")
    private rankHandler: RankHandler
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

  public allUsersTerminated(user: Socket, userScoreDto: UserScoreDto): boolean {
    // 50/20/-10
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    this.gameRoomHandler.increaseAcceptCount(user);
    if (gameRoom.getAcceptCount() == 1) {
      this.rankHandler.setRank(gameRoom);
    }
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      return true;
    }
    this.rankHandler.pushUserScore(gameRoom, userScoreDto);
    return false;
  }

  public caculateRank(user: Socket): GameTerminatedDto[] {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    return this.rankHandler.calculateRank(gameRoom);
  }

  public async saveReplay(
    gameRoom: GameRoom,
    userId: string,
    userVocal: Blob[]
  ) {
    const songId = gameRoom.getGameSongDto().songId;
    const gameEvent = gameRoom.getGameEvent();
    const gameEventJson = JSON.stringify(gameEvent);
    console.log(gameEventJson);
    // 같이 게임한 유저 정보 및 유저 캐릭터 정보도 추가해야함
    const gameReplayEntity: CreateReplayInput = {
      userId: userId,
      userCharacter: "userCharacter",
      songId: songId,
      userVocal: "파일 url",
      gameEvent: "파일 url",
      player1Id: "player1Id",
      player1Character: "player1Character",
      player2Id: "player2Id",
      player2Character: "player2Character",
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
