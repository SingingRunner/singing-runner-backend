import { Module } from "@nestjs/common";
import { MyroomService } from "./myroom.service";
import { MyroomResolver } from "./myroom.resolver";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { GameModule } from "src/game/game.module";

@Module({
  imports: [AuthModule, UserModule, GameModule],
  providers: [MyroomService, MyroomResolver],
})
export class MyRoomModule {}
