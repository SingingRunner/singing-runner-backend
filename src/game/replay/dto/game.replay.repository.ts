import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameReplayEntity } from "../entity/game.replay.entity";
import { Repository } from "typeorm";

@Injectable()
export class GameReplayRepository {
  // private gameReplayRepository: Repository<GameReplay>;
  constructor(
    @InjectRepository(GameReplayEntity)
    private gameReplayRepository: Repository<GameReplayEntity>
  ) {}
}
