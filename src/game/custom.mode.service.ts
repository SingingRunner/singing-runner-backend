import { SongService } from 'src/song/song.service';
import { UserMatchDto } from 'src/user/dto/user.match.dto';
import { GameRoom } from './room/game.room';
import { GameRoomHandler } from './room/game.room.handler';
import { Injectable } from "@nestjs/common";
import { Socket } from 'socket.io';
import { UserGameDto } from 'src/user/dto/user.game.dto';
import { GameSongDto } from 'src/song/dto/game-song.dto';

@Injectable()
export class CustomModeService{

	constructor(
        private gameRoomHandler:GameRoomHandler,
        private songService:SongService,
        ) {}
    private songListIndex = 0;

    public async createCustomRoom(user:Socket, userMatchDto:UserMatchDto){
        const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);
        const gameRoom: GameRoom = await this.gameRoomHandler.createRoom();
        this.gameRoomHandler.joinRoom(gameRoom, userGameDto);
        gameRoom.setRoomMaster(userMatchDto.userId);
        gameRoom.setSongListInCustom(await this.songService.getAllSong());
    }

    public joinCustomRoom(user:Socket, userMatchDto:UserMatchDto, gameRoom: GameRoom){
        const userGameDto: UserGameDto = new UserGameDto(user, userMatchDto);
        this.gameRoomHandler.joinRoom(gameRoom, userGameDto);
    }

    public chooseSong(gameRoom: GameRoom): GameSongDto{
        const songList: GameSongDto[] = gameRoom.getSongListinCustom();
        const song: GameSongDto = songList[this.songListIndex];
        gameRoom.setGameSongDto(song);
        this.songListIndex++;
        if(this.songListIndex >= songList.length){
            this.songListIndex = 0;
        }
        return song;
    }

    public findRoomByUserId(roomMaster: string): GameRoom{
        return this.gameRoomHandler.findRoomByUserId(roomMaster);
    }
    
}