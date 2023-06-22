import { Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { characterEnum } from "src/user/util/character.enum";
import { KeynoteEnum } from "src/user/util/keynote.enum";

@Injectable()
export class MyroomService {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  async logout(user: User): Promise<string> {
    try {
      return await this.authService.logout(user);
    } catch (err) {
      throw new Error("로그아웃에 실패했습니다.");
    }
  }

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

  async updateUserKeynote(userId: string, keynote: KeynoteEnum): Promise<User> {
    const user: User | null = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("해당하는 유저가 없습니다.");
    }
    user.userKeynote = keynote;
    return await this.userService.saveUser(user);
  }
}
