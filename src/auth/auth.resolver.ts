import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "../user/dto/user.register.dto";
import { UserAuthDto } from "../user/dto/user.auth.dto";
import { UserService } from "src/user/user.service";
import { AuthUserDto } from "./dto/auth-user.dto";
import { AuthDto } from "./dto/auth.dto";
import { AuthTokenDto } from "./dto/auth-token.dto";
import { UserContext } from "./util/auth.context";
import { GqlAuthAccessGuard } from "./security/auth.guard";
import { KakaoUserResponseDto } from "src/user/dto/kakao-user-response.dto";
import { GoogleUserResponseDto } from "src/user/dto/google-user-response.dto";

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
      throw new HttpException(
        "데이터가 없습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const registeredUser = await this.authService.registerUser(newUser);

    const userAuthDto = new UserAuthDto();
    userAuthDto.userEmail = registeredUser.userEmail;
    userAuthDto.password = newUser.password || "";

    // 자동으로 로그인 되도록 함
    return await this.loginUser(userAuthDto, context);
  }

  @Query(() => Boolean)
  async isEmailTaken(@Args("userEmail") userEmail: string): Promise<boolean> {
    const user = await this.userService.findByFields({
      where: { userEmail: userEmail },
    });
    return user ? true : false;
  }

  @Query(() => Boolean)
  async isNicknameTaken(@Args("nickname") nickname: string): Promise<boolean> {
    const user = await this.userService.findByFields({
      where: { nickname: nickname },
    });
    return user ? true : false;
  }

  @Mutation(() => AuthDto)
  async registerUserWithKakao(
    @Args("kakaoUserResponse") kakaoUserResponse: KakaoUserResponseDto,
    @Args("nickname") nickname: string,
    @Context() context: any
  ): Promise<AuthDto> {
    await this.authService.registerUserWithKakao(kakaoUserResponse, nickname);

    // 자동으로 카카오 로그인 사용자 로그인
    return await this.loginUserWithKakao(kakaoUserResponse, context);
  }

  @Mutation(() => AuthDto)
  async registerUserWithGoogle(
    @Args("googleUserDto") googleUserResponse: GoogleUserResponseDto,
    @Args("nickname") nickname: string,
    @Context() context: any
  ): Promise<AuthDto> {
    await this.authService.registerUserWithGoogle(googleUserResponse, nickname);

    // 자동으로 Google 로그인 사용자 로그인
    return await this.loginUserWithGoogle(googleUserResponse, context);
  }

  @Mutation(() => AuthDto)
  async loginUser(
    @Args("userAuthDto") userAuthDto: UserAuthDto,
    @Context() context: any
  ): Promise<AuthDto> {
    const jwt = await this.authService.validateUserAndSetCookie(
      userAuthDto,
      context.res
    );

    return {
      accessToken: jwt.accessToken,
      user: jwt.user,
    };
  }

  @Mutation(() => AuthDto)
  async loginUserWithKakao(
    @Args("kakaoUserResponse") kakaoUserResponse: KakaoUserResponseDto,
    @Context() context: any
  ): Promise<AuthDto> {
    const user = await this.authService.findUserWithKakao(kakaoUserResponse);

    // 로그인되는 유저 정보를 기반으로 토큰 생성
    return await this.authService.createToken(user, context);
  }

  @Mutation(() => AuthDto)
  async loginUserWithGoogle(
    @Args("googleUserResponse") googleUserResponse: GoogleUserResponseDto,
    @Context() context: any
  ): Promise<AuthDto> {
    const user = await this.authService.findUserWithGoogle(googleUserResponse);

    // 로그인되는 유저 정보를 기반으로 토큰 생성
    return await this.authService.createToken(user, context);
  }

  @Mutation(() => AuthTokenDto)
  async refreshAccessToken(@Context() context: any): Promise<AuthTokenDto> {
    const refreshToken = context.req.cookies["refreshToken"];
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return { accessToken: accessToken.accessToken };
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => AuthUserDto)
  async fetchUser(@Context() context: UserContext): Promise<AuthUserDto> {
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

    authUser.userTier = this.userService.determineUserTier(authUser.userMmr);

    return authUser;
  }

  @Query(() => AuthUserDto)
  async fetchUserByUserId(
    @Args("userId") userId: string
  ): Promise<AuthUserDto> {
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

    authUser.userTier = this.userService.determineUserTier(authUser.userMmr);

    return authUser;
  }
}
