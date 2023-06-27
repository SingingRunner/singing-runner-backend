import { GameRoom } from "../room/game.room";
import { GameRoomHandler } from "../room/game.room.handler";
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameSongDto } from "src/song/dto/game-song.dto";

import { SongService } from "src/song/song.service";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { UserMatchDto } from "src/user/dto/user.match.dto";
import { CustomSongDto } from "../util/custom-song.dto";
import { UserService } from "src/user/user.service";
import { SocialService } from "src/social/social.service";
import { User } from "src/user/entity/user.entity";
import { CustomUserInfoDto } from "../util/custom-user.info.dto";

@Injectable()
export class CustomModeService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    private songService: SongService,
    private userService: UserService,
    private socialService: SocialService
  ) {}

  public async createCustomRoom(user: Socket, userMatchDto: UserMatchDto) {
    const userGameDto: UserGameDto = this.createUserGameDto(user, userMatchDto);
    const gameRoom: GameRoom = await this.createRoom();
    this.addUserToRoom(gameRoom, userGameDto);
    this.setRoomMaster(gameRoom, userMatchDto.userId);
  }

  public leaveRoom(userMatchDto: UserMatchDto) {
    const gameRoom: GameRoom = this.findRoomByUserId(userMatchDto.userId);
    if (this.isRoomMaster(userMatchDto, gameRoom)) {
      this.gameRoomHandler.deleteRoom(userMatchDto.userId);
      return;
    }
    this.gameRoomHandler.leaveRoom(gameRoom, userMatchDto.userId);
  }

  private isRoomMaster(
    userMatchDto: UserMatchDto,
    gameRoom: GameRoom
  ): boolean {
    if (gameRoom.getRoomMaster() === userMatchDto.userId) {
      return false;
    }
    return true;
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

  public async joinCustomRoom(
    userSocket: Socket,
    userId: string,
    gameRoom: GameRoom
  ) {
    const userMatchDto = new UserMatchDto();
    const user: User = await this.userService.findUserById(userId);
    userMatchDto.character = user.character;
    userMatchDto.nickname = user.nickname;
    userMatchDto.userActive = user.userActive;
    userMatchDto.userId = user.userId;
    userMatchDto.userMmr = user.userMmr;
    const userGameDto: UserGameDto = new UserGameDto(userSocket, userMatchDto);
    this.addUserToRoom(gameRoom, userGameDto);
  }

  public findRoomByUserId(roomMaster: string): GameRoom {
    return this.gameRoomHandler.findRoomByUserId(roomMaster);
  }

  public async acceptInvite(user: Socket, userId: string, host) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomByUserId(
      host.userId
    );
    await this.joinCustomRoom(user, userId, gameRoom);
  }

  public findUsersInSameRoom(user: Socket): UserGameDto[] {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    return this.gameRoomHandler.findUsersInRoom(gameRoom);
  }

  public setCustomUserInfo(user: Socket): CustomUserInfoDto[] {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userGameDtoList: UserGameDto[] =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    const hostId: string = gameRoom.getRoomMaster();
    const customUserList: CustomUserInfoDto[] = [];
    let hostNickname = " ";
    for (const userGameDto of userGameDtoList) {
      if (userGameDto.getUserMatchDto().userId == hostId) {
        hostNickname = userGameDto.getUserMatchDto().nickname;
        break;
      }
    }
    for (const userGameDto of userGameDtoList) {
      const customUserInfoDto: CustomUserInfoDto = new CustomUserInfoDto();
      customUserInfoDto.character = userGameDto.getUserMatchDto().character;
      customUserInfoDto.nickname = userGameDto.getUserMatchDto().nickname;
      customUserInfoDto.userId = userGameDto.getUserMatchDto().userId;
      customUserInfoDto.userTier = this.userService.determineUserTier(
        userGameDto.getUserMatchDto().userMmr
      );
      customUserInfoDto.hostId = hostId;
      customUserInfoDto.hostNickname = hostNickname;
      customUserInfoDto.roomId = gameRoom.getRoomId();
      customUserList.push(customUserInfoDto);
    }
    return customUserList;
  }

  public async checkFriend(
    userGameDto: UserGameDto,
    customUserInfoDto: CustomUserInfoDto
  ) {
    const friendList = await this.socialService.getFriendList(
      userGameDto.getUserMatchDto().userId
    );

    if (friendList === null) {
      return;
    }

    for (const friend of friendList) {
      if (friend.userId === customUserInfoDto.userId) {
        customUserInfoDto.isFriend = true;
        return;
      }
    }
    customUserInfoDto.isFriend = false;
  }

  public async setCustomSong(
    user: Socket,
    songId: number
  ): Promise<CustomSongDto> {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const gameSongDto: GameSongDto = await this.songService.getSongById(songId);
    gameRoom.setGameSongDto(gameSongDto);
    return new CustomSongDto(
      gameSongDto.songId,
      gameSongDto.songTitle,
      gameSongDto.singer
    );
  }

  public async getUserMatchDtobyId(userId: string): Promise<UserMatchDto> {
    const userMatchDto = new UserMatchDto();
    const user: User = await this.userService.findUserById(userId);
    userMatchDto.character = user.character;
    userMatchDto.nickname = user.nickname;
    userMatchDto.userActive = user.userActive;
    userMatchDto.userId = user.userId;
    userMatchDto.userMmr = user.userMmr;
    return userMatchDto;
  }
}
