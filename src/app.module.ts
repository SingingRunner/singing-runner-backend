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

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot(TypeORMConfig),
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
