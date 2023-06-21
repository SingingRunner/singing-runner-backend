import { UnauthorizedException, UseGuards } from "@nestjs/common";
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Context,
} from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./user/dto/user.register.dto";
import { UserLoginDto } from "./user/dto/user.login.dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "./user/entity/user.entity";

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

  @Query(() => String)
  @UseGuards(AuthGuard("jwt"))
  isAuthenticated(@Args("token") token: string) {
    const user = this.authService.validateToken(token);
    return user;
  }
}
