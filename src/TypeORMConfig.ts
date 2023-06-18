import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Song } from "src/song/entities/song.entity";

export const TypeORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  username: "root",
  password: "@hyeongin2024",
  port: 3306,
  host: "localhost",
  database: "singing",
  entities: [Song],
  synchronize: true,
};
