import { Injectable } from "@nestjs/common";
import { FindOptionsOrder, Like, Repository } from "typeorm";
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

  public async searchSong(
    keyword: string,
    page: number,
    filter: string
  ): Promise<GameSongDto[]> {
    const take = 10;
    const skip = (page - 1) * take;

    const order: FindOptionsOrder<Song> = {
      [filter]: "ASC",
      songId: "ASC",
    };

    const searchResult: Song[] = await this.songRepository.find({
      where: [
        { songTitle: Like(`%${keyword}%`) },
        { singer: Like(`%${keyword}%`) },
      ],
      take: take,
      skip: skip,
      order: order,
    });

    const gameSongDtoList: GameSongDto[] = [];
    for (const result of searchResult) {
      gameSongDtoList.push(new GameSongDto(result));
    }
    return gameSongDtoList;
  }

  public async getSongById(songId: number): Promise<GameSongDto> {
    const song: Song | null = await this.songRepository.findOne({
      where: { songId: songId },
    });

    if (song === null) {
      throw new Error("없는 SongID 입니다.");
    }

    return new GameSongDto(song);
  }
}
