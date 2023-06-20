import { v4 as uuidv4 } from "uuid";
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
import { characterEnum } from "./user/util/character.enum";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async registerUser(newUser: UserRegisterDTO): Promise<User> {
    const userFind: User | null = await this.userService.findByFields({
      where: { userEmail: newUser.userEmail },
    });

    if (userFind) {
      throw new HttpException(
        "이미 존재하는 이메일입니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    const userRegisterDTO: UserRegisterDTO = {
      userEmail: newUser.userEmail,
      password: newUser.password,
      nickname: newUser.nickname,
    };

    const savedUserDTO: UserRegisterDTO = await this.userService.save(
      userRegisterDTO
    );

    const user: User = new User();
    user.userId = uuidv4();
    user.userEmail = savedUserDTO.userEmail;
    user.password = savedUserDTO.password;
    user.nickname = savedUserDTO.nickname;
    user.userActive = false;
    user.userKeynote = false;
    user.userMmr = 0;
    user.userPoint = 0;
    user.character = characterEnum.BELUGA;

    return user;
  }

  async validateUser(
    UserLoginDTO: UserLoginDTO
  ): Promise<{ accessToken: string; user: User }> {
    const userFind: User | null = await this.userService.findByFields({
      where: { userEmail: UserLoginDTO.userEmail },
    });

    if (!userFind) {
      throw new UnauthorizedException("유저를 찾을 수 없습니다.");
    }

    const validatePassword = await bcrypt.compare(
      UserLoginDTO.password,
      userFind.password
    );

    if (!validatePassword) {
      throw new UnauthorizedException("비밀번호가 틀렸습니다.");
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
      user: userFind,
    };
  }

  async tokenValidateUser(payload: Payload): Promise<User> {
    const userFind: User | null = await this.userService.findByFields({
      where: { userEmail: payload.userEmail },
    });

    if (!userFind) {
      throw new UnauthorizedException("유저를 찾을 수 없습니다.");
    }

    return userFind;
  }

  async validateToken(token: string): Promise<User> {
    try {
      const payload: Payload = this.jwtService.verify(token);
      const userFind: User | null = await this.userService.findByFields({
        where: { userEmail: payload.userEmail },
      });

      if (!userFind) {
        throw new UnauthorizedException("유저를 찾을 수 없습니다.");
      }

      return userFind;
    } catch (err) {
      throw new UnauthorizedException("토큰이 유효하지 않습니다.");
    }
  }
}
