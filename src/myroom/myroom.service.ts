import { Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/user/entity/user.entity";

@Injectable()
export class MyroomService {
  constructor(private authService: AuthService) {}

  async logout(user: User): Promise<string> {
    try {
      return await this.authService.logout(user);
    } catch (err) {
      throw new Error("로그아웃에 실패했습니다.");
    }
  }
}
