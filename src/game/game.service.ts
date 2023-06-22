import { GameRoomHandler } from "./room/game.room.handler";
import { Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameRoom } from "./room/game.room";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { ItemPolicy } from "./item/item.policy";
import { GameSongDto } from "src/song/dto/game-song.dto";
import { CreateReplayInput } from "./replay/dto/create-replay.input";
import { GameEventDto } from "./event/dto/game.event.dto";
import { UserScoreDto } from "./rank/dto/user-score.dto";
import { RankHandler } from "./rank/rank.hanlder";
import { GameTerminatedDto } from "./rank/game-terminated.dto";
import { GameReplayService } from "./replay/game.replay.service";

@Injectable()
export class GameService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject("ItemPolicy")
    private itemPolicy: ItemPolicy,
    @Inject("RankHandler")
    private rankHandler: RankHandler,
    private gameReplayService: GameReplayService
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
    const gameSong = gameSongdto;
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
    const filename = `${userId}_${songId}_${new Date().getTime()}`;
    const gameEvent = gameRoom.getGameEvent();
    const gameEventJson = JSON.stringify(gameEvent);
    const users = this.gameRoomHandler.findUsersInRoom(gameRoom);

    let mainUser = users[0].getUserMatchDto().userId;
    let subUser1 = users[1].getUserMatchDto().userId;
    let subUser2 = users[2].getUserMatchDto().userId;
    let mainCharacter = users[0].getUserMatchDto().character;
    let subCharacter1 = users[1].getUserMatchDto().character;
    let subCharacter2 = users[2].getUserMatchDto().character;
    let userKeynote = users[0].getUserMatchDto().userKeynote;

    users.forEach((user, i) => {
      if (user.getUserMatchDto().userId === userId) {
        mainUser = user.getUserMatchDto().userId;
        userKeynote = user.getUserMatchDto().userKeynote;
        subUser1 = users[(i + 1) % 3].getUserMatchDto().userId;
        subUser2 = users[(i + 2) % 3].getUserMatchDto().userId;
        mainCharacter = user.getUserMatchDto().character;
        subCharacter1 = users[(i + 1) % 3].getUserMatchDto().userId;
        subCharacter2 = users[(i + 2) % 3].getUserMatchDto().userId;
      }
    });

    const eventUrl = await this.gameReplayService.saveGameEvent(
      gameEventJson,
      filename
    );
    const vocalUrl = await this.gameReplayService.saveVocal(
      userVocal,
      filename
    );
    console.log(gameEventJson);
    // 같이 게임한 유저 정보 및 유저 캐릭터 정보도 추가해야함
    const gameReplayEntity: CreateReplayInput = {
      userId: mainUser,
      userCharacter: mainCharacter,
      songId: songId,
      userVocal: vocalUrl,
      gameEvent: eventUrl,
      player1Id: subUser1,
      player1Character: subCharacter1,
      player2Id: subUser2,
      player2Character: subCharacter2,
      keynote: userKeynote,
    };
    console.log(userVocal);
    return await this.gameReplayService.saveReplay(gameReplayEntity);
  }

  public putEvent(
    gameRoom: GameRoom,
    eventName: string,
    eventContent: string,
    userSocket: Socket
  ) {
    const currentTime = new Date().getTime() - gameRoom.getStartTime();
    const users = this.gameRoomHandler.findUsersInRoom(gameRoom);
    let userId = users[0].getUserMatchDto().userId;
    users.forEach((user) => {
      if (user.getSocket().id === userSocket.id) {
        userId = user.getUserMatchDto().userId;
      }
    });
    const gameEvent: GameEventDto = new GameEventDto(
      currentTime,
      userId,
      eventName,
      eventContent
    );
    gameRoom.putGameEvent(gameEvent);
  }
}
