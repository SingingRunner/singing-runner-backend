import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "./payload.interface";

export class JwtAccessStrategy extends PassportStrategy(Strategy, "access") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // 토큰 만료 여부 확인
      secretOrKey: "SECRET_KEY",
    });
  }

  // 토큰이 유효한지 확인 -> console에 payload 출력
  validate(payload: Payload) {
    console.log(payload);
    return {
      userId: payload.userId,
    };
  }
}
