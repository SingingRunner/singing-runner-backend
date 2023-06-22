import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRegisterDto } from "./dto/user.register.dto";
import { FindOneOptions, Repository } from "typeorm";
import { User } from "./entity/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findByFields(option: FindOneOptions<User>): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne(option);
    return user;
  }

  async save(userRegisterDto: UserRegisterDto): Promise<UserRegisterDto> {
    if (userRegisterDto.password) {
      await this.transformPassword(userRegisterDto);
    }
    console.log(userRegisterDto);
    return await this.userRepository.save(userRegisterDto);
  }

  async transformPassword(userRegister: UserRegisterDto): Promise<void> {
    userRegister.password = await bcrypt.hash(userRegister.password, 10);
    return Promise.resolve();
  }

  // in UserService
  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  async update(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { userId } });
  }
}
