import { Module } from "@nestjs/common";
import { MyroomService } from "./myroom.service";
import { MyroomResolver } from "./myroom.resolver";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [AuthModule, UserModule],
  providers: [MyroomService, MyroomResolver],
})
export class MyRoomModule {}
