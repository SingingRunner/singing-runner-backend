import { SocialService } from "./../social/social.service";
import { UserService } from "src/user/user.service";
import { GameRoomHandler } from "./room/game.room.handler";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
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
import { User } from "src/user/entity/user.entity";
import { userActiveStatus } from "src/user/util/user.enum";
import { UserInfoDto } from "./util/user-info.dto";
import { Item } from "./item/item.enum";

@Injectable()
export class GameService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject("ItemPolicy")
    private itemPolicy: ItemPolicy,
    @Inject("RankHandler")
    private rankHandler: RankHandler,
    private gameReplayService: GameReplayService,
    private userService: UserService,
    private socialService: SocialService
  ) {}

  public loadData(userId: string) {
    const gameRoom: GameRoom = this.findRoomByUserId(userId);
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
    return { gameSong: gameSong, characterList: characterList };
  }

  public isGameReady(userId: string): boolean {
    const gameRoom: GameRoom = this.findRoomByUserId(userId);

    this.gameRoomHandler.increaseAcceptCount(userId);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      gameRoom.setStartTime(new Date().getTime());
      gameRoom.resetAcceptCount();
      return true;
    }
    return false;
  }

  public findUsersSocketInSameRoom(user): Socket[] {
    const gameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userGameDtoList: UserGameDto[] =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    const usersSocket: Socket[] = [];

    for (const userGameDto of userGameDtoList) {
      usersSocket.push(userGameDto.getSocket());
    }

    return usersSocket;
  }
  public getUserInfoBySocket(user: Socket) {
    const gameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const UserGameDtoList: UserGameDto[] =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    for (const userGameDto of UserGameDtoList) {
      if (userGameDto.getSocket() === user) {
        const userId: string = userGameDto.getUserMatchDto().userId;
        const nickname: string = userGameDto.getUserMatchDto().nickname;
        return new UserInfoDto(userId, nickname);
      }
    }
  }

  public resetItem() {
    this.itemPolicy.useItemAll(Item.NULL);
  }
  public exitWhileInGame(user: Socket) {
    const gameRoom = this.gameRoomHandler.findRoomBySocket(user);
    if (gameRoom === null || gameRoom === undefined) {
      return false;
    }
    const users = this.gameRoomHandler.findUsersInRoom(gameRoom);
    if (users[0].getUserMatchDto().userActive === userActiveStatus.IN_GAME) {
      return true;
    }

    return false;
  }

  public leaveRoom(userId: string) {
    const gameRoom = this.findRoomByUserId(userId);
    this.gameRoomHandler.leaveRoom(gameRoom, userId);
  }

  public findUsersIdInSameRoom(userId: string): string[] {
    const gameRoom: GameRoom = this.findRoomByUserId(userId);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    const userIdList: string[] = [];
    for (const userInfo of userList) {
      userIdList.push(userInfo.getUserMatchDto().userId);
    }
    return userIdList;
  }

  public getItem(userId: string) {
    return this.itemPolicy.getItems(userId);
  }

  public allUsersTerminated(userScoreDto: UserScoreDto): boolean {
    // 50/20/-10
    const gameRoom: GameRoom = this.findRoomByUserId(userScoreDto.userId);
    this.gameRoomHandler.increaseAcceptCount(userScoreDto.userId);
    if (gameRoom.getAcceptCount() === 1) {
      this.rankHandler.setRank(gameRoom);
    }

    this.rankHandler.pushUserScore(gameRoom, userScoreDto);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      gameRoom.resetAcceptCount();
      return true;
    }
    return false;
  }

  public async calculateRank(userId: string): Promise<GameTerminatedDto[]> {
    const gameRoom: GameRoom = this.findRoomByUserId(userId);
    const userList: UserGameDto[] =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    const gameTerminatedList = this.rankHandler.calculateRank(
      gameRoom,
      userList
    );
    await this.updateMmr(gameTerminatedList);
    return gameTerminatedList;
  }

  private async updateMmr(gameTerminiatedDtoList: GameTerminatedDto[]) {
    for (const gameTerminatedDto of gameTerminiatedDtoList) {
      await this.userService.updateMmr(
        gameTerminatedDto.getUserId(),
        gameTerminatedDto.getMmrDiff()
      );
    }
  }

  public async setGameTerminatedCharacter(
    gameTerminatedDto: GameTerminatedDto
  ) {
    const user: User | null = await this.userService.findUserById(
      gameTerminatedDto.getUserId()
    );
    if (user === null) {
      throw new HttpException("없는 유저", HttpStatus.BAD_REQUEST);
    }
    gameTerminatedDto.setCharacter(user.character);
  }

  public findRoomByUserId(userId: string): GameRoom {
    const gameRoom: GameRoom | undefined =
      this.gameRoomHandler.findRoomByUserId(userId);
    if (gameRoom === undefined) {
      throw new HttpException(
        "can not find room by userId",
        HttpStatus.BAD_REQUEST
      );
    }
    return gameRoom;
  }

  public async setGameTerminatedDto(
    userGame: UserGameDto,
    gameTerminatedDto: GameTerminatedDto
  ) {
    this.setTerminatedUserNickname(
      userGame.getUserMatchDto().userId,
      gameTerminatedDto
    );
    const userMatchDto = userGame.getUserMatchDto();
    const friendList: User[] = await this.getFriendList(userMatchDto.userId);

    if (friendList === null) {
      return;
    }
    for (const friend of friendList) {
      if (friend.userId === gameTerminatedDto.getUserId()) {
        gameTerminatedDto.setIsFriend(true);

        return;
      }
      gameTerminatedDto.setIsFriend(false);
    }
  }

  private setTerminatedUserNickname(
    userId: string,
    gameTerminatedDto: GameTerminatedDto
  ) {
    const gameRoom: GameRoom = this.findRoomByUserId(userId);
    const userList: UserGameDto[] =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    for (const userGameDto of userList) {
      if (
        userGameDto.getUserMatchDto().userId === gameTerminatedDto.getUserId()
      ) {
        gameTerminatedDto.setNickname(userGameDto.getUserMatchDto().nickname);
        return;
      }
    }
  }

  public async updateUserActive(userId: string, userActive: userActiveStatus) {
    await this.userService.updateUserActive(userId, userActive);
  }

  private async getFriendList(userId: string): Promise<User[]> {
    return await this.socialService.getFriendList(userId);
  }

  public async saveReplay(userId: string, userVocal: string) {
    const gameRoom: GameRoom = this.findRoomByUserId(userId);
    const user: User | null = await this.userService.findUserById(userId);
    const songId = gameRoom.getGameSongDto().songId;
    const filename = `${userId}_${songId}_${new Date().getTime()}`;
    const gameEvent = gameRoom.getGameEvent();
    const gameEventJson = JSON.stringify(gameEvent);
    const users = this.gameRoomHandler.findUsersInRoom(gameRoom);

    let subUser1 = "none";
    let subUser2 = "none";
    let mainCharacter = users[0].getUserMatchDto().character;
    let subCharacter1 = "none";
    let subCharacter2 = "none";
    let userKeynote = users[0].getUserMatchDto().userKeynote;

    users.forEach((user) => {
      if (user.getUserMatchDto().userId === userId) {
        userKeynote = user.getUserMatchDto().userKeynote;
        mainCharacter = user.getUserMatchDto().character;
      } else {
        if (subUser1 === "none") {
          subUser1 = user.getUserMatchDto().userId;
          subCharacter1 = user.getUserMatchDto().character;
        } else if (subUser2 === "none") {
          subUser2 = user.getUserMatchDto().userId;
          subCharacter2 = user.getUserMatchDto().character;
        }
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
    // 같이 게임한 유저 정보 및 유저 캐릭터 정보도 추가해야함
    if (user === null) {
      return;
    }
    const gameReplayEntity: CreateReplayInput = {
      user: user,
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
    await this.gameReplayService.saveReplay(gameReplayEntity);
    this.gameRoomHandler.increaseAcceptCount(userId);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      this.gameRoomHandler.deleteRoom(userId);
      return;
    }
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
