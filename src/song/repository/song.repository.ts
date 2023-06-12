import { Injectable } from '@nestjs/common';
import { Song } from '../entities/song.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SongRepository {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}
}
