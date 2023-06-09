import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtAccessStrategy } from "./security/passport.jwt.strategy";
import { AuthResolver } from "./auth.resolver";
import { UserModule } from "src/user/user.module";
import { SocialModule } from "src/social/social.module";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: "300s" },
    }),
    UserModule,
    PassportModule,
    SocialModule,
  ],
  providers: [AuthService, JwtAccessStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
