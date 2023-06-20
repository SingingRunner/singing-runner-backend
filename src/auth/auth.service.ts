import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRegisterDTO } from "./user/dto/user.register.dto";
import { UserService } from "./user/user.service";
import { UserLoginDTO } from "./user/dto/user.login.dto";
import { User } from "./user/entity/user.entity";
import * as bcrypt from "bcrypt";
import { Payload } from "./security/payload.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async registerUser(newUser: UserRegisterDTO): Promise<UserRegisterDTO> {
    const userFind: UserRegisterDTO = await this.userService.findByFields({
      where: { userEmail: newUser.userEmail },
    });

    if (userFind) {
      throw new HttpException(
        "이미 존재하는 이메일입니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.userService.save(newUser);
  }

  async validateUser(
    UserLoginDTO: UserLoginDTO
  ): Promise<{ accessToken: string }> {
    const userFind: User = await this.userService.findByFields({
      where: { userEmail: UserLoginDTO.userEmail },
    });
    const validatePassword = await bcrypt.compare(
      UserLoginDTO.password,
      userFind.password
    );
    if (!userFind || !validatePassword) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 틀렸습니다.");
    }
    const payload: Payload = {
      userId: userFind.userId,
      userEmail: userFind.userEmail,
      nickname: userFind.nickname,
      userActive: userFind.userActive,
      userKeynote: userFind.userKeynote,
      userMmr: userFind.userMmr,
      userPoint: userFind.userPoint,
      character: userFind.character,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async tokenValidateUser(payload: Payload): Promise<User> {
    const userFind = await this.userService.findByFields({
      where: { userEmail: payload.userEmail },
    });
    return userFind;
  }
}
