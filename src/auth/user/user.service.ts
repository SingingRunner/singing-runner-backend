import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRegisterDTO } from "./dto/user.register.dto";
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

  async save(userRegisterDTO: UserRegisterDTO): Promise<UserRegisterDTO> {
    if (userRegisterDTO.password) {
      await this.transformPassword(userRegisterDTO);
    }
    console.log(userRegisterDTO);
    return await this.userRepository.save(userRegisterDTO);
  }

  async transformPassword(userRegister: UserRegisterDTO): Promise<void> {
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
}
