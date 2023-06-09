import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GameModule } from "./game/game.module";
import { SongModule } from "./song/song.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeORMConfig } from "./TypeORMConfig";
import { AuthModule } from "./auth/auth.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { MyRoomModule } from "./myroom/myroom.module";
import { SocialModule } from "./social/social.module";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot(TypeORMConfig),
    ScheduleModule.forRoot(),
    GameModule,
    SongModule,
    AuthModule,
    MyRoomModule,
    SocialModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
