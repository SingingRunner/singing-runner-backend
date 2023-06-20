import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GameReplayEntity } from "./entity/game.replay.entity";

@Injectable()
export class GameReplayRepository {
  constructor(
    @InjectRepository(GameReplayEntity)
    private userRepository: Repository<GameReplayEntity>
  ) {}
}
