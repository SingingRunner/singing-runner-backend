import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "./payload.interface";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "access") {
  constructor(private configService: ConfigService) {
    const secretKey = configService.get<string>("SECRET_KEY"); // 토큰 시크릿 키
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  // 토큰이 유효한지 확인 -> console에 payload 출력
  validate(payload: Payload) {
    return {
      userId: payload.userId,
      userEmail: payload.userEmail,
      nickname: payload.nickname,
      userActive: payload.userActive,
      userKeynote: payload.userKeynote,
      userMmr: payload.userMmr,
      userPoint: payload.userPoint,
      character: payload.character,
    };
  }
}
