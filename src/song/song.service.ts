import { Injectable } from "@nestjs/common";
import { Like, Repository } from "typeorm";
import { Song } from "./entities/song.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GameSongDto } from "./dto/game-song.dto";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Redis } from "@nestjs-modules/ioredis";

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    @InjectRedis() private readonly redis: Redis
  ) {
    this.songRepository.find().then((songs: Song[]) => {
      this.redis.set("songList", JSON.stringify(songs), "EX", 60 * 60 * 24);
      songs.forEach((song: Song) => {
        this.redis.set(
          "song:${song.songId}.${song.songTitle}",
          JSON.stringify(song),
          "EX",
          60 * 60 * 24
        );
      });
    });
  }

  /* DB에서 모든 Song 데이터 가져와서 임의의 노래 반환하는 비동기 함수 */
  public async getRandomSong(): Promise<GameSongDto> {
    // DB에서 모든 Song 데이터 가져오기
    let songs: Song[] = JSON.parse((await this.redis.get("songList")) || "");
    if (songs === null || songs === undefined || songs.length === 0) {
      songs = await this.songRepository.find();
    }
    // songs 배열의 길이만큼 랜덤한 인덱스 생성
    const randomIndex: number = Math.floor(Math.random() * songs.length);
    const song: Song = songs[randomIndex];

    // Song Entity를 GameSongDto로 변환
    return new GameSongDto(song);
  }

  public async searchSong(
    keyword: string,
    page: number,
    filter: string
  ): Promise<GameSongDto[]> {
    const take = 10;
    const skip = (page - 1) * take;

    const order = {};

    order[filter] = "ASC";

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
