import { UserGameDto } from 'src/user/dto/user.game.dto';
import { MatchMakingPolicy } from './match/match.making.policy';
import { GameRoomHandler } from './room/game.room.handler';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameRoom } from './room/game.room';
import { UserMatchDto } from 'src/user/dto/user.match.dto';

@Injectable()
export class GameService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject('MatchMakingPolicy')
    private matchMakingPolicy: MatchMakingPolicy,
  ) {}

  public matchMaking(user: Socket, userMatchDto: UserMatchDto) {
    const userGameDto = this.initUserGameDto(user, userMatchDto);
    if (this.isMatchingAvailable()) {
      const userList: Array<UserGameDto> =
        this.matchMakingPolicy.getAvailableUsers();

      userList.push(userGameDto);
      this.joinRoom(userList);
      for (const user of userList) {
        user.socket.emit('match_making', true); //songTilte, singer DTO를 전송
      }
      return;
    }
    this.matchMakingPolicy.joinQueue(userGameDto);
  }

  public matchAccept(user: Socket, accept: boolean) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    if (!accept) {
      for (const user of userList) {
        this.matchMakingPolicy.joinQueueAtFront(user);
      }
      this.gameRoomHandler.deleteRoom(user);
      for (const user of userList) {
        user.socket.emit('accept', false);
      }
      return;
    }

    this.gameRoomHandler.increaseAcceptCount(user);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      for (const user of userList) {
        user.socket.emit('accept', true);
      }
    }
  }

  private isMatchingAvailable(): boolean {
    if (this.matchMakingPolicy.isQueueReady()) {
      return true;
    }
    return false;
  }

  private joinRoom(userList: Array<UserGameDto>) {
    const gameRoom: GameRoom = this.gameRoomHandler.createRoom();
    this.gameRoomHandler.addUser(gameRoom, userList);
  }

  private initUserGameDto(
    socket: Socket,
    userMatchDto: UserMatchDto,
  ): UserGameDto {
    const userGameDto: UserGameDto = {
      userName: userMatchDto.userName,
      userMMR: userMatchDto.userMMR,
      nickname: userMatchDto.userName,
      userActive: userMatchDto.userActive,
      userKeynote: userMatchDto.userKeynote,
      socket: socket,
    };
    return userGameDto;
  }
}
