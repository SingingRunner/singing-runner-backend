import { Injectable } from "@nestjs/common";
import { SongService } from "src/song/song.service";
import { Repository } from "typeorm";
import { GameReplayEntity } from "./entity/game.replay.entity";
import { Socket } from "socket.io";
import { GameSongDto } from "src/song/dto/game-song.dto";
import * as AWS from "aws-sdk";
import { CreateReplayInput } from "./dto/create-replay.input";
import { InjectRepository } from "@nestjs/typeorm";
import { ReplayInfoDto } from "./dto/replay-info.dto";
import { ReplaySongDto } from "./dto/replay-song.dto";

const s3 = new AWS.S3();

interface ReplayWithSongInfo
  extends Omit<
    GameReplayEntity,
    "song" | "hasId" | "save" | "remove" | "softRemove" | "recover" | "reload"
  > {
  songTitle: string;
  singer: string;
}

@Injectable()
export class GameReplayService {
  constructor(
    private songService: SongService,
    @InjectRepository(GameReplayEntity)
    private gameReplayRepository: Repository<GameReplayEntity>
  ) {
    s3.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_BUCKET_REGION,
    });
  }

  public async saveReplay(gameReplayEntity: CreateReplayInput) {
    return await this.gameReplayRepository.save(
      this.gameReplayRepository.create(gameReplayEntity)
    );
  }

  public async saveVocal(
    filebase64: string,
    filename: string
  ): Promise<string> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: `${filename}.txt`,
      Body: filebase64,
      ContentType: "text/plain",
    };
    s3.upload(params, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return `https://${
      process.env.AWS_S3_BUCKET_NAME as string
    }.s3.amazonaws.com/${filename}.txt`;
  }

  public async saveGameEvent(
    gameEvent: string,
    filename: string
  ): Promise<string> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: `${filename}.json`,
      Body: gameEvent,
      ContentType: "application/json",
    };
    s3.upload(params, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return `${filename}.json`;
  }

  public async loadData(replayId: number) {
    const gameReplay: GameReplayEntity | null =
      await this.gameReplayRepository.findOne({
        where: { replayId: replayId },
      });
    if (gameReplay !== null) {
      const gameSongdto: GameSongDto | null =
        await this.songService.getSongById(gameReplay.songId);
      if (gameSongdto !== null) {
        const gameSong = gameSongdto;
        const characterList: any = [];
        characterList.push({
          userId: gameReplay.userId,
          character: gameReplay.userCharacter,
        });
        if (gameReplay.player1Id !== "none") {
          characterList.push({
            userId: gameReplay.player1Id,
            character: gameReplay.player1Character,
          });
        }
        if (gameReplay.player2Id !== "none") {
          characterList.push({
            userId: gameReplay.player2Id,
            character: gameReplay.player2Character,
          });
        }
        return {
          gameSong: gameSong,
          characterList: characterList,
          userVocal: gameReplay.userVocal,
          replayKeynote: gameReplay.keynote,
          userCharacter: gameReplay.userCharacter,
        };
      }
    }
  }

  public async replayGame(user: Socket, replayId: number, userId: string) {
    const gameReplay = await this.gameReplayRepository.findOne({
      where: { replayId: replayId },
    });
    if (!gameReplay) return;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: gameReplay.gameEvent,
    };
    s3.getObject(params, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data.Body !== null && data.Body !== undefined) {
        this.parseEventAndPlay(data.Body.toString(), user, userId);
      }
    });
  }

  private parseEventAndPlay(rawEvent: string, user: Socket, userId: string) {
    const gameEventList: string[] = JSON.parse(rawEvent);
    user.emit("start_replay");
    gameEventList.forEach((rawGameEvent: string) => {
      const gameEvent = JSON.parse(rawGameEvent);
      const eventName = gameEvent.eventName;
      if (eventName === "get_item") {
        if (gameEvent.getUserId() !== userId) {
          return;
        }
      } else if (eventName === "game_terminated") {
        gameEvent.eventContent = JSON.parse(gameEvent.eventContent);
      }
      setTimeout(() => {
        user.emit(eventName, gameEvent.eventContent);
      }, gameEvent.timestamp);
    });
  }
  /**
   * 유저 게임 리플레이를 가져오기
   * @param isMyReplay - 사용자의 리플레이만 가져올지, 또는 공개 리플레이를 가져올지 결정하는 flag
   * @param pageNumber - 가져올 리플레이의 수
   * @param userId - 리플레이를 가져올 userId
   * @returns 리플레이 노래 정보, 게임 리플레이 배열 반환
   */
  public async getUserReplays(
    isMyReplay: boolean,
    pageNumber: number,
    userId: string
  ): Promise<ReplayWithSongInfo[]> {
    const take = 10; // 각 페이지에 표시될 리플레이 수
    const skip = (pageNumber - 1) * take; // 표시할 페이지 계산

    // 리플레이 가져오는 쿼리(각 리플레이와 함께 노래 데이터)
    const replaysQuery = this.gameReplayRepository
      .createQueryBuilder("gameReplay")
      .innerJoinAndSelect("gameReplay.song", "song")
      .orderBy("gameReplay.createdAt", "DESC") // 리플레이 생성 날짜 순 정렬
      .skip(skip)
      .take(take);

    if (isMyReplay) {
      // 해당 유저 리플레이만 가져오기
      replaysQuery.andWhere("gameReplay.user.userId = :userId", { userId });
    } else {
      // 해당 유저의 공개 리플레이 가져오기
      replaysQuery.andWhere(
        "gameReplay.user.userId = :userId AND gameReplay.isPublic = true",
        { userId }
      );
    }

    // 쿼리 실행 및 결과 가져오기
    const replays = await replaysQuery.getMany();

    // 각 리플레이에 대해 songTitle, singer 추가한 새 객체 반환
    return replays.map((replay) => {
      const { song, ...rest } = replay; // 'song'을 제외한 나머지 -> 'rest'에 할당
      return {
        ...rest, // 'rest'에 있는 속성들 복사
        songTitle: song.songTitle,
        singer: song.singer,
      };
    });
  }

  public async getReplayInfo(replayId: number) {
    console.log(replayId);
    const replay = await this.gameReplayRepository.findOne({
      where: { replayId: replayId },
      relations: ["song"],
    });

    console.log(replay);

    if (!replay) {
      throw new Error("해당 리플레이가 존재하지 않습니다.");
    }

    const replayInfo = new ReplayInfoDto();
    replayInfo.gameEvent = replay.gameEvent;
    replayInfo.gameSong = new ReplaySongDto(replay.song);
    console.log(replay);
    replayInfo.replayKeynote = replay.keynote;
    replayInfo.userVocal = replay.userVocal;
    replayInfo.characterList = [
      { userId: replay.userId, character: replay.userCharacter },
      { userId: replay.player1Id, character: replay.player1Character },
      { userId: replay.player2Id, character: replay.player2Character },
    ];

    return replayInfo;
  }

  public async updateReplayIsPublic(
    replayId: number,
    isPublic: number
  ): Promise<GameReplayEntity> {
    const replay = await this.gameReplayRepository.findOne({
      where: { replayId: replayId },
    });
    if (!replay) {
      throw new Error("해당 리플레이가 존재하지 않습니다.");
    }
    replay.isPublic = isPublic;
    return await this.gameReplayRepository.save(replay);
  }
}
