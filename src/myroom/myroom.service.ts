import { Injectable } from "@nestjs/common";
import { User } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { characterEnum } from "src/user/util/character.enum";
import { UserKeynoteStatus } from "src/user/util/user.enum";

@Injectable()
export class MyroomService {
  constructor(private userService: UserService) {}

  async updateCharacter(
    userId: string,
    character: characterEnum
  ): Promise<User> {
    const user: User | null = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("해당하는 유저가 없습니다.");
    }
    user.character = character;
    return await this.userService.saveUser(user);
  }

  async updateUserKeynote(
    userId: string,
    keynote: UserKeynoteStatus
  ): Promise<User> {
    const user: User | null = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("해당하는 유저가 없습니다.");
    }
    user.userKeynote = keynote;
    return await this.userService.saveUser(user);
  }
}
