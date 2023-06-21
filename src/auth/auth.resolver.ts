import { UseGuards } from "@nestjs/common";
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./user/dto/user.register.dto";
import { UserLoginDto } from "./user/dto/user.login.dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "./user/entity/user.entity";
import { UserService } from "./user/user.service";

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
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Mutation(() => User)
  async registerUser(@Args("newUser") newUser: UserRegisterDto): Promise<User> {
    if (!newUser) {
      throw new Error("데이터가 없습니다.");
    }
    return await this.authService.registerUser(newUser);
  }

  @Mutation(() => Auth)
  async loginUser(
    @Args("userLoginDto") userLoginDto: UserLoginDto
  ): Promise<Auth> {
    const jwt = await this.authService.validateUser(userLoginDto);
    return {
      accessToken: jwt.accessToken,
      user: jwt.user,
    };
  }

  @Mutation(() => Token)
  async getRefreshToken(
    @Args("userLoginDto") userLoginDto: UserLoginDto
  ): Promise<Token> {
    const { user } = await this.authService.validateUser(userLoginDto);
    const refreshToken = this.authService.generateRefreshToken(user.userId);

    await this.userService.updateRefreshToken(user.userId, refreshToken);

    return { accessToken: refreshToken };
  }

  @Query(() => String)
  @UseGuards(AuthGuard("jwt"))
  isAuthenticated(@Args("token") token: string) {
    const user = this.authService.validateToken(token);
    return user;
  }
}
