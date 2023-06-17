import { UserMatchDto } from 'src/user/dto/user.match.dto';
import { GameRoom } from './room/game.room';
import { GameRoomHandler } from './room/game.room.handler';
import { Injectable } from "@nestjs/common";
import { Socket } from 'socket.io';
import { UserGameDto } from 'src/user/dto/user.game.dto';

@Injectable()
export class CustomModeService{

	constructor(private gameRoomHandler:GameRoomHandler) {}

    public async createCustomRoom(user:Socket, userMatchDto:UserMatchDto){
        const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);
        const gameRoom: GameRoom = await this.gameRoomHandler.createRoom();
        this.gameRoomHandler.joinRoom(gameRoom, userGameDto);
        gameRoom.setRoomMaster(userMatchDto.userId);
    }

    public joinCustomRoom(user:Socket, userMatchDto:UserMatchDto, roomMaster: string){
        const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);
        const gameRoom: GameRoom = this.gameRoomHandler.findRoomByUserId(roomMaster);
        this.gameRoomHandler.joinRoom(gameRoom, userGameDto);
    }
    
}