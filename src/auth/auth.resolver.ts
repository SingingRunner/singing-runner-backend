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

@ObjectType()
class Auth {
  @Field(() => String)
  accessToken: string;

  @Field(() => User)
  user: User;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

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

  @Query(() => String)
  @UseGuards(AuthGuard("jwt"))
  isAuthenticated(@Args("token") token: string) {
    const user = this.authService.validateToken(token);
    return user;
  }
}
