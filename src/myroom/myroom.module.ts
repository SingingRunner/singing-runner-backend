import { Module } from "@nestjs/common";
import { MyroomService } from "./myroom.service";
import { MyroomResolver } from "./myroom.resolver";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [MyroomService, MyroomResolver],
})
export class MyRoomModule {}
