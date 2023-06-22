import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "../user/user.service";
import { User } from "../user/entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtAccessStrategy } from "./security/passport.jwt.strategy";
import { AuthResolver } from "./auth.resolver";

@Module({
  imports: [
    JwtModule.register({
      secret: "SECRET_KEY",
      signOptions: { expiresIn: "300s" },
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule,
  ],
  providers: [AuthService, UserService, JwtAccessStrategy, AuthResolver],
  exports: [UserService, AuthService],
})
export class AuthModule {}
