import { GameRoomHandler } from "./room/game.room.handler";
import { Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameRoom } from "./room/game.room";
import { UserGameDto } from "src/user/dto/user.game.dto";
import { ItemPolicy } from "./item/item.policy";
import { GameSongDto } from "src/song/dto/game-song.dto";
import { UserCharacterDto } from "src/user/dto/user-character.dto";

@Injectable()
export class GameService {
  constructor(
    private gameRoomHandler: GameRoomHandler,
    @Inject("ItemPolicy")
    private itemPolicy: ItemPolicy
  ) {}

  public loadData(user: Socket) {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: UserGameDto[] = this.gameRoomHandler.findUsersInRoom(gameRoom);
    const characterList = [];
    for (const user of userList){
      characterList
      .push({
        "userId":user.getUserMatchDto().userId, 
        "character":user.getUserMatchDto().character
      })
    }
    const gameSongdto: GameSongDto = gameRoom.getGameSongDto();
    const gameSong = gameSongdto.toJSON();
    user.emit("loading", {"gameSong":gameSong, "characterList" :characterList});
  }

  public isGameReady(user: Socket):boolean {
    const gameRoom: GameRoom = this.gameRoomHandler.findRoomBySocket(user);

    this.gameRoomHandler.increaseAcceptCount(user);
    if (this.gameRoomHandler.isGameRoomReady(gameRoom)) {
      gameRoom.resetAcceptCount();
      return true;
    }
    return false;
  }

  public findUsersIdInSameRoom(user: Socket) : string[]{
    const gameRoom:GameRoom = this.gameRoomHandler.findRoomBySocket(user);
    const userList: Array<UserGameDto> =
      this.gameRoomHandler.findUsersInRoom(gameRoom);
    const userIdList: string[] = [];
    for (const userInfo of userList) {
      userIdList.push(userInfo.getUserMatchDto().userId);
    }
    return userIdList;
  }
  
  public getItem(){
    return this.itemPolicy.getItems();
  }

  // public gameEvent(){
  //  GameRoom 마다 replay용 game event 저장.
  // }

  //게임종료시 DB에 event 저장
}
