import { GameRoom } from './../room/game.room';
import { UserGameDto } from 'src/user/dto/user.game.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserMatchDto } from 'src/user/dto/user.match.dto';
import { GameRoomHandler } from '../room/game.room.handler';
import { MatchMakingPolicy } from './match.making.policy';

@Injectable()
export class MatchService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject('MatchMakingPolicy')
    private matchMakingPolicy: MatchMakingPolicy,
  ) {}

  public async matchMaking(user: Socket, userMatchDto: UserMatchDto) {
    const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);

    if (this.isMatchingAvailable()) {
      const userList: Array<UserGameDto> =
        this.matchMakingPolicy.getAvailableUsers();
      userList.push(userGameDto);
      await this.joinRoom(userList);
      const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
      for (const user of userList) {
        user
          .getSocket()
          .emit('match_making', this.gameRoomHandler.getSongInfo(gameRoom));
      }
      return;
    }
    this.matchMakingPolicy.joinQueue(userGameDto);
  }

  public matchAccept(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    this.gameRoomHandler.increaseAcceptCount(user);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      gameRoom.resetAcceptCount();
      for (const user of userList) {
        user.getSocket().emit('accept', true);
      }
    }
  }

  public matchDeny(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    for (const userInfo of userList) {
      this.joinQueueWithOutDenyUser(userInfo, user);
    }
    this.gameRoomHandler.deleteRoom(user);
    const filteredDenyUser: Array<UserGameDto> = userList.filter(
      (userInfo) => userInfo.getSocket() !== user,
    );
    user.disconnect(true);
    for (const userInfo of filteredDenyUser) {
      userInfo.getSocket().emit('accept', false);
    }
    return;
  }

  private joinQueueWithOutDenyUser(userInfo: UserGameDto, user: Socket) {
    if (userInfo.getSocket() === user) {
      return;
    }
    this.matchMakingPolicy.joinQueueAtFront(userInfo);
  }

  private isMatchingAvailable(): boolean {
    if (this.matchMakingPolicy.isQueueReady()) {
      return true;
    }
    return false;
  }

  private async joinRoom(userList: Array<UserGameDto>) {
    const gameRoom: GameRoom = await this.gameRoomHandler.createRoom();
    this.gameRoomHandler.addUser(gameRoom, userList);
  }
}
