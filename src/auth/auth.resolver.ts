import { UnauthorizedException, UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "../user/dto/user.register.dto";
import { UserLoginDto } from "../user/dto/user.login.dto";
import { UserService } from "src/user/user.service";
import { AuthUserDto } from "./dto/auth.user.dto";
import { AuthDto } from "./dto/auth.dto";
import { AuthTokenDto } from "./dto/auth.token.dto";
import { UserContext } from "./auth.context";
import { GqlAuthAccessGuard } from "./security/auth.guard";

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Mutation(() => AuthDto)
  async registerUser(
    @Args("newUser") newUser: UserRegisterDto,
    @Context() context: any
  ): Promise<AuthDto> {
    if (!newUser) {
      throw new Error("데이터가 없습니다.");
    }
    const registeredUser = await this.authService.registerUser(newUser);

    const userLoginDto = new UserLoginDto();
    userLoginDto.userEmail = registeredUser.userEmail;
    userLoginDto.password = newUser.password;

    // 자동으로 로그인 되도록 함
    return await this.loginUser(userLoginDto, context);
  }

  @Mutation(() => AuthDto)
  async loginUser(
    @Args("userLoginDto") userLoginDto: UserLoginDto,
    @Context() context: any
  ): Promise<AuthDto> {
    console.log(context);

    const jwt = await this.authService.validateUserAndSetCookie(
      userLoginDto,
      context.res
    );

    return {
      accessToken: jwt.accessToken,
      user: jwt.user,
    };
  }

  @Mutation(() => AuthTokenDto)
  async refreshAccessToken(@Context() context: any): Promise<AuthTokenDto> {
    const refreshToken = context.req.cookies["refreshToken"];
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return { accessToken: accessToken.accessToken };
  }

  // 권한 부여된 유저만 접근 가능하도록 하는 fetchUser
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => AuthUserDto)
  fetchUserGuard(@Context() context: UserContext): AuthUserDto {
    console.log("================");
    console.log(context.req.user);
    console.log("================");

    const authUser = new AuthUserDto();
    if (!context.req.user) {
      throw new UnauthorizedException("유저 정보가 없습니다.");
    }
    authUser.userId = context.req.user.userId ?? "No User ID";
    authUser.userEmail = context.req.user.userEmail ?? "No User Email";
    authUser.nickname = context.req.user.nickname ?? "No Nickname";
    authUser.userActive = context.req.user.userActive ?? 0;
    authUser.userKeynote = context.req.user.userKeynote ?? 0;
    authUser.userMmr = context.req.user.userMmr ?? 0;
    authUser.userPoint = context.req.user.userPoint ?? 0;
    authUser.character = context.req.user.character ?? "beluga";

    if (authUser.userMmr < 2000) {
      authUser.userTier = "BRONZE";
    } else if (authUser.userMmr < 3000) {
      authUser.userTier = "SILVER";
    } else if (authUser.userMmr < 4000) {
      authUser.userTier = "GOLD";
    } else if (authUser.userMmr < 5000) {
      authUser.userTier = "PLATINUM";
    } else {
      authUser.userTier = "DIAMOND";
    }

    return authUser;
  }

  // 권한 부여되지 않아도 되는 fetchUser
  @Query(() => AuthUserDto)
  async fetchUser(@Args("userId") userId: string): Promise<AuthUserDto> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException("유저 정보가 없습니다.");
    }

    const authUser = new AuthUserDto();
    authUser.userId = user.userId ?? "No User ID";
    authUser.userEmail = user.userEmail ?? "No User Email";
    authUser.nickname = user.nickname ?? "No Nickname";
    authUser.userActive = user.userActive ?? 0;
    authUser.userKeynote = user.userKeynote ?? 0;
    authUser.userMmr = user.userMmr ?? 0;
    authUser.userPoint = user.userPoint ?? 0;
    authUser.character = user.character ?? "beluga";

    if (authUser.userMmr < 2000) {
      authUser.userTier = "BRONZE";
    } else if (authUser.userMmr < 3000) {
      authUser.userTier = "SILVER";
    } else if (authUser.userMmr < 4000) {
      authUser.userTier = "GOLD";
    } else if (authUser.userMmr < 5000) {
      authUser.userTier = "PLATINUM";
    } else {
      authUser.userTier = "DIAMOND";
    }

    return authUser;
  }
}
