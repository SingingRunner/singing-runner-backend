import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Payload } from "./payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // 토큰 만료 여부 확인
      secretOrKey: "SECRET_KEY",
    });
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<void> {
    const user = await this.authService.tokenValidateUser(payload);
    if (!user) {
      return done(
        new UnauthorizedException({ message: "유저가 존재하지 않습니다." })
      );
    }
    return done(null, user);
  }
}
