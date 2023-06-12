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

  async getRandomSong(): Promise<Song> {
    const songs = await this.songRepository.find();
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
  }
}
