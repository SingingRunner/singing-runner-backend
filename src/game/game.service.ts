import { GameRoomHandler } from './room/game.room.handler';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameRoom } from './room/game.room';
import { UserGameDto } from 'src/user/dto/user.game.dto';
import { ItemPolicy } from './item/item.policy';
import { Item } from './item/item.enum';

@Injectable()
export class GameService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject('ItemPolicy')
    private itemPolicy: ItemPolicy,
  ) {}

  public loadData(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    user.emit('loading', gameRoom.getGameSongDto);
  }

  public gameReady(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);

    this.gameRoomHandler.increaseAcceptCount(user);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      gameRoom.resetAcceptCount();
      this.broadcastGameRoom(gameRoom);
    }
  }

  private broadcastGameRoom(gameRoom: GameRoom) {
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    const userIdList: string[] = [];
    for (const userInfo of userList) {
      userIdList.push(userInfo.getSocket().id);
    }
    for (const userInfo of userList) {
      userInfo.getSocket().emit('game_ready', userIdList);
    }
  }

  public broadcastScore(user: Socket, score: number) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    for (const userInfo of userList) {
      if (user === userInfo.getSocket()) {
        continue;
      }
      userInfo.getSocket().emit('score', { user: user.id, score: score });
    }
  }

  public itemGenerate(user: Socket) {
    const item = this.itemPolicy.getItems();
    if (item === null) return;
    console.log(item);
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    for (const userInfo of userList) {
      userInfo.getSocket().emit('get_item', item);
    }
  }

  public useItem(user: Socket, item: Item) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    if (this.itemPolicy.useItemAll(item)) {
      for (const userInfo of userList) {
        userInfo.getSocket().emit('use_item', item);
      }
      return;
    }
    for (const userInfo of userList) {
      if (userInfo.getSocket() === user) {
        continue;
      }
      userInfo.getSocket().emit('use_item', item);
    }
  }

  public escapeItem(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);

    for (const userInfo of userList) {
      if (user === userInfo.getSocket()) {
        continue;
      }
      userInfo.getSocket().emit('escape_item', user.id);
    }
  }
}
