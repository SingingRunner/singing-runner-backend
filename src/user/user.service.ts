import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRegisterDto } from "./dto/user.register.dto";
import { FindOneOptions, Like, Repository } from "typeorm";
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

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  async update(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { userId } });
  }

  public async searchUser(nickname: string, page: number): Promise<User[]> {
    const take = 10;
    const skip = (page - 1) * take;
    const searchResult: User[] = await this.userRepository.find({
      where: [{ nickname: Like(`%${nickname}%`) }],
      take: take,
      skip: skip,
    });
    return searchResult;
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  determineUserTier(userMmr: number): string {
    if (userMmr < 2000) {
      return "BRONZE";
    } else if (userMmr < 3000) {
      return "SILVER";
    } else if (userMmr < 4000) {
      return "GOLD";
    } else if (userMmr < 5000) {
      return "PLATINUM";
    } else {
      return "DIAMOND";
    }
  }
}
