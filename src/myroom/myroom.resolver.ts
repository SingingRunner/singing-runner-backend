import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserService } from "src/user/user.service";
import { AuthService } from "src/auth/auth.service";
import { MyroomService } from "./myroom.service";

@Resolver()
export class MyroomResolver {
  constructor(
    private myroomService: MyroomService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Mutation(() => String)
  async logout(@Args("userId") userId: string): Promise<string> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("해당하는 유저가 없습니다.");
    }
    try {
      return await this.authService.logout(user);
    } catch (err) {
      throw new Error("로그아웃에 실패했습니다.");
    }
  }
}
