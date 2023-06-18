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

  async findByFields(option: FindOneOptions<User>): Promise<User> {
    const user: User | null = await this.userRepository.findOne(option);
    if (user === null) {
      throw new Error("not found User");
    }
    return user;
  }

  async save(userRegisterDTO: UserRegisterDTO): Promise<UserRegisterDTO> {
    await this.transformPassword(userRegisterDTO);
    console.log(userRegisterDTO);
    return await this.userRepository.save(userRegisterDTO);
  }

  async transformPassword(userRegister: UserRegisterDTO): Promise<void> {
    userRegister.password = await bcrypt.hash(userRegister.password, 10);
    return Promise.resolve();
  }
}
