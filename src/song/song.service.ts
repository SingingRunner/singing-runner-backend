import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Song } from "./entities/song.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GameSongDto } from "./dto/game-song.dto";

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>
  ) {}

  /* DB에서 모든 Song 데이터 가져와서 임의의 노래 반환하는 비동기 함수 */
  public async getRandomSong(): Promise<GameSongDto> {
    // DB에서 모든 Song 데이터 가져오기
    const songs: Song[] = await this.songRepository.find();
    // songs 배열의 길이만큼 랜덤한 인덱스 생성
    const randomIndex: number = Math.floor(Math.random() * songs.length);
    const song: Song = songs[randomIndex];

    // Song Entity를 GameSongDto로 변환
    return new GameSongDto(song);
  }

  public async getAllSong(): Promise<GameSongDto[]> {
    const songs: Song[] = await this.songRepository.find();
    const gameSongDtoList: GameSongDto[] = [];
    for (const song of songs) {
      gameSongDtoList.push(new GameSongDto(song));
    }
    return gameSongDtoList;
  }

  public async getSongById(songId: number): Promise<GameSongDto> {
    const song: Song | null = await this.songRepository.findOne({
      where: { songId: songId },
    });
    if (song !== null) {
      return new GameSongDto(song);
    } else {
      const song: Song = {
        songId: -1,
        songTitle: "not found",
        singer: "not found",
        songLyrics: "not found",
        songGender: false,
        songMale: "not found",
        songMaleUp: "not found",
        songMaleDown: "not found",
        songFemale: "not found",
        songFemaleUp: "not found",
        songFemaleDown: "not found",
        vocalMale: "not found",
        vocalMaleUp: "not found",
        vocalMaleDown: "not found",
        vocalFemale: "not found",
        vocalFemaleUp: "not found",
        vocalFemaleDown: "not found",
        createdAt: new Date(),
      };
      return new GameSongDto(song);
    }
  }
}
