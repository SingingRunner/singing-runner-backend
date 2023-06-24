import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtAccessStrategy } from "./security/passport.jwt.strategy";
import { AuthResolver } from "./auth.resolver";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    JwtModule.register({
      secret: "SECRET_KEY",
      signOptions: { expiresIn: "300s" },
    }),
    UserModule,
    PassportModule,
  ],
  providers: [AuthService, JwtAccessStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
