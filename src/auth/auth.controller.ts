import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserRegisterDTO } from "./user/dto/user.register.dto";
import { UserLoginDTO } from "./user/dto/user.login.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async registerUser(
    @Body() newUser: UserRegisterDTO
  ): Promise<UserRegisterDTO> {
    if (!newUser) {
      throw new HttpException("데이터가 없습니다.", HttpStatus.BAD_REQUEST);
    }
    return await this.authService.registerUser(newUser);
  }

  @Post("login")
  async loginUser(
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) res
  ): Promise<{ accessToken: string }> {
    const jwt = await this.authService.validateUser(userLoginDTO);
    res.cookie("jwt", jwt.accessToken, { httpOnly: true });
    return jwt;
  }

  @Get("authenticate")
  @UseGuards(AuthGuard("jwt"))
  isAuthenticated(@Req() req) {
    const user = req.user;
    return user;
  }
}
