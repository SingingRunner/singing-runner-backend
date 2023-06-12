import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  /* DB에서 모든 Song 데이터 가져와서 임의의 노래 반환하는 비동기 함수 */
  async getRandomSong(): Promise<Song> {
    // DB에서 모든 Song 데이터 가져오기
    const songs = await this.songRepository.find();
    // songs 배열의 길이만큼 랜덤한 인덱스 생성
    const randomIndex = Math.floor(Math.random() * songs.length);
    // songs 배열에서 랜덤한 인덱스의 Song 반환
    return songs[randomIndex];
  }
}
