import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Song } from "src/song/entities/song.entity";
import { User } from "./user/entity/user.entity";
import { GameReplayEntity } from "./game/replay/entity/game.replay.entity";
import { Social } from "./social/entity/social.entity";

export const TypeORMConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  entities: [Song, User, GameReplayEntity, Social],
  synchronize: false,
};
