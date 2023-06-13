import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMatchDto } from '../dto/user.match.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserMatchDto)
    private userRepository: Repository<UserMatchDto>,
  ) {}
}
