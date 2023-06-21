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
import { UserRegisterDTO } from "./user/dto/user.register.dto";
import { UserLoginDTO } from "./user/dto/user.login.dto";
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
  async registerUser(@Args("newUser") newUser: UserRegisterDTO): Promise<User> {
    if (!newUser) {
      throw new Error("데이터가 없습니다.");
    }
    return await this.authService.registerUser(newUser);
  }

  @Mutation(() => Auth)
  async loginUser(
    @Args("userLoginDTO") userLoginDTO: UserLoginDTO
  ): Promise<Auth> {
    const jwt = await this.authService.validateUser(userLoginDTO);
    return {
      accessToken: jwt.accessToken,
      user: jwt.user,
    };
  }

  @Mutation(() => Token)
  async getRefreshToken(
    @Args("userLoginDTO") userLoginDTO: UserLoginDTO
  ): Promise<Token> {
    const { user } = await this.authService.validateUser(userLoginDTO);
    const refreshToken = this.authService.generateRefreshToken(user.userId);

    user.refreshToken = refreshToken;
    await this.userService.update(user);

    return { accessToken: refreshToken };
  }

  @Query(() => String)
  @UseGuards(AuthGuard("jwt"))
  isAuthenticated(@Args("token") token: string) {
    const user = this.authService.validateToken(token);
    return user;
  }
}
