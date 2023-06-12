import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongModule } from './song/song.module';
import { Song } from './song/entities/song.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Chomk130!!',
      database: 'singingRunner',
      entities: [Song],
      synchronize: true,
      logging: true,
    }),
    SongModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
