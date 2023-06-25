/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from "uuid";
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRegisterDto } from "../user/dto/user.register.dto";
import { UserService } from "../user/user.service";
import { UserLoginDto } from "../user/dto/user.login.dto";
import { User } from "../user/entity/user.entity";
import * as bcrypt from "bcrypt";
import { Payload } from "./security/payload.interface";
import { JwtService } from "@nestjs/jwt";
import { characterEnum } from "../user/util/character.enum";
import { Response } from "express";
import { userActiveStatus } from "src/user/util/user.enum";
import { HeartBeat } from "src/social/heartbeat/hearbeat";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject("HeartBeat")
    private hearBeat: HeartBeat
  ) {}

  async registerUser(newUser: UserRegisterDto): Promise<User> {
    const userFind: User | null = await this.userService.findByFields({
      where: { userEmail: newUser.userEmail },
    });

    if (userFind) {
      throw new HttpException(
        "이미 존재하는 이메일입니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    const userRegisterDto: UserRegisterDto = {
      userEmail: newUser.userEmail,
      password: newUser.password,
      nickname: newUser.nickname,
    };

    const savedUserDto: UserRegisterDto = await this.userService.save(
      userRegisterDto
    );

    const user: User = new User();
    user.userId = uuidv4();
    user.userEmail = savedUserDto.userEmail;
    user.password = savedUserDto.password;
    user.nickname = savedUserDto.nickname;
    user.userActive = 0;
    user.userKeynote = 0;
    user.userMmr = 0;
    user.userPoint = 0;
    user.character = characterEnum.BELUGA;

    return user;
  }

  // 랜덤으로 refresh token 생성
  generateRefreshToken(userId: string): string {
    const jwtConstants = {
      SECRET_KEY: "SECRET_KEY",
    };

    const expiresIn = "14d";
    const secret = jwtConstants.SECRET_KEY;
    const payload = { userId: userId };

    return this.jwtService.sign(payload, { expiresIn });
  }

  async validateUserAndSetCookie(
    UserLoginDto: UserLoginDto,
    res: Response
  ): Promise<{ accessToken: string; user: Omit<User, "refreshToken"> }> {
    const userFind: User | null = await this.userService.findByFields({
      where: { userEmail: UserLoginDto.userEmail },
    });

    if (!userFind) {
      throw new UnauthorizedException("유저를 찾을 수 없습니다.");
    }

    const validatePassword = await bcrypt.compare(
      UserLoginDto.password,
      userFind.password
    );

    if (!validatePassword) {
      throw new UnauthorizedException("비밀번호가 틀렸습니다.");
    }

    //로그인 성공 시 HearbeatMap 에 저장
    this.hearBeat.setHeartBeatMap(userFind.userId, Date.now());

    // 로그인 성공 시, 유저 userActive를 'Connect'(1)로 변경
    userFind.userActive = userActiveStatus.CONNECT;
    await this.userService.saveUser(userFind);

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

    const refreshToken: string = this.generateRefreshToken(userFind.userId);
    await this.userService.updateRefreshToken(userFind.userId, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/refresh_token",
    });

    const { refreshToken: _, ...userWithoutRefreshToken } = userFind;

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: "2m" }),
      user: userWithoutRefreshToken as User,
    };
  }

  async refreshAccessToken(token: string): Promise<{ accessToken: string }> {
    const user: User | null = await this.userService.findByFields({
      where: { refreshToken: token }, // refreshToken 필드로 유저 검색
    });

    if (!user) {
      throw new UnauthorizedException("유저를 찾을 수 없습니다.");
    }

    const payload: Payload = {
      userId: user.userId,
      userEmail: user.userEmail,
      nickname: user.nickname,
      userActive: user.userActive,
      userKeynote: user.userKeynote,
      userMmr: user.userMmr,
      userPoint: user.userPoint,
      character: user.character,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: "2m" });

    return { accessToken };
  }

  async logout(user: User): Promise<string> {
    try {
      user.refreshToken = null;
      user.userActive = userActiveStatus.LOGOUT;
      this.hearBeat.deleteHeartBeatMap(user.userId);
      await this.userService.saveUser(user);
      return "로그아웃 성공";
    } catch (err) {
      throw new Error("로그아웃 실패");
    }
  }
}
