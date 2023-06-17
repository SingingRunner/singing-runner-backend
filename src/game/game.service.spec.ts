import { Test, TestingModule } from "@nestjs/testing";
import { GameService } from "./game.service";
import { GameRoomHandler } from "./room/game.room.handler";
import { SimpleItemPolicy } from "./item/simple.item.policy";
import { SongService } from "src/song/song.service";

describe("GameService", () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService, GameRoomHandler,
        {
          provide: "ItemPolicy",
          useClass: SimpleItemPolicy,
        }
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it("should be defined", () => {
    
    expect(service).toBeDefined();
  });
});
