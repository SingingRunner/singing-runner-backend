import { UserGameDto } from 'src/user/dto/user.game.dto';
import { MatchMakingPolicy } from './match/match.making.policy';
import { GameRoomHandler } from './room/game.room.handler';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameRoom } from './room/game.room';

@Injectable()
export class GameService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject('MatchMakingPolicy')
    private matchMakingPolicy: MatchMakingPolicy,
  ) {}

  public isMatchingAvailable(userGameDto: UserGameDto): boolean {
    if (this.matchMakingPolicy.isQueueReady()) {
      const userList: Array<UserGameDto> =
        this.matchMakingPolicy.getAvailableUsers();

      userList.push(userGameDto);
      this.joinRoom(userList);
      return true;
    }
    this.matchMakingPolicy.joinQueue(userGameDto);
    return false;
  }

  private joinRoom(userList: Array<UserGameDto>) {
    const gameRoom: GameRoom = this.gameRoomHandler.createRoom();
    this.gameRoomHandler.addUser(gameRoom, userList);
  }

  public findUsersInSameRoom(user: Socket): Array<UserGameDto> {
    return this.gameRoomHandler.findUsersInRoom(user);
  }
}
