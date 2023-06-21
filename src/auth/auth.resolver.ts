import { UnauthorizedException, UseGuards } from "@nestjs/common";
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
  Int,
} from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./user/dto/user.register.dto";
import { UserLoginDto } from "./user/dto/user.login.dto";
import { User } from "./user/entity/user.entity";
import { GqlAuthAccessGuard } from "./security/auth.guard";
import { UserContext } from "src/commons/context";

@ObjectType()
class AuthUser {
  // Define the fields that you want to return to the client
  @Field(() => String)
  userId: string;

  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  nickname: string;

  @Field(() => Int)
  userActive: number;

  @Field(() => Int)
  userKeynote: number;

  @Field(() => Int)
  userMmr: number;

  @Field(() => Int)
  userPoint: number;

  @Field(() => String)
  character: string;
}

@ObjectType()
class Auth {
  @Field(() => String)
  accessToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
class Token {
  @Field(() => String)
  accessToken: string;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  async registerUser(@Args("newUser") newUser: UserRegisterDto): Promise<User> {
    if (!newUser) {
      throw new Error("데이터가 없습니다.");
    }
    return await this.authService.registerUser(newUser);
  }

  @Mutation(() => Auth)
  async loginUser(
    @Args("userLoginDto") userLoginDto: UserLoginDto,
    @Context() context: any
  ): Promise<Auth> {
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

  @Mutation(() => Token)
  async refreshAccessToken(@Context() context: any): Promise<Token> {
    const refreshToken = context.req.cookies["refreshToken"];
    if (!refreshToken) {
      throw new UnauthorizedException("리프레시 토큰을 찾을 수 없습니다.");
    }
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return { accessToken: accessToken.accessToken };
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => AuthUser)
  fetchUser(@Context() context: UserContext): AuthUser {
    console.log("================");
    console.log(context.req.user);
    console.log("================");

    const authUser = new AuthUser();
    if (!context.req.user) {
      throw new UnauthorizedException("유저 정보가 없습니다.");
    } else {
      authUser.userId = context.req.user.userId ?? "No User ID";
      authUser.userEmail = context.req.user.userEmail ?? "No User Email";
      authUser.nickname = context.req.user.nickname ?? "No Nickname";
      authUser.userActive = context.req.user.userActive ?? 0;
      authUser.userKeynote = context.req.user.userKeynote ?? 0;
      authUser.userMmr = context.req.user.userMmr ?? 0;
      authUser.userPoint = context.req.user.userPoint ?? 0;
      authUser.character = context.req.user.character ?? "beluga";
    }
    return authUser;
  }
}
