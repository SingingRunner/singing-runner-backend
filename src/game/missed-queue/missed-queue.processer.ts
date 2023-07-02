import { Processor } from "@nestjs/bull";
import { GameGateway } from "../game.gateway";

@Processor("missed")
export class MissedQueueProcesser {
  constructor(private readonly gameGateway: GameGateway) {}
}
