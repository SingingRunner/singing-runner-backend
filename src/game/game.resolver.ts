import {
  Args,
  Context,
  Field,
  Int,
  Mutation,
  ObjectType,
  Resolver,
} from "@nestjs/graphql";
import { GameService } from "./game.service";
import { GameReplayService } from "./replay/game.replay.service";

@ObjectType()
class SaveReplay {
  @Field(() => Int)
  replayId: number;

  @Field(() => Int)
  status: number;

  @Field(() => String)
  message: string;
}

@Resolver()
export class GameResolver {
  constructor(
    private gameService: GameService,
    private gameReplayService: GameReplayService
  ) {}

  @Mutation(() => SaveReplay)
  async saveReplay(
    @Args("userId") userId: string,
    @Args("userVocal") userVocal: Blob[],
    @Context() context: any
  ): Promise<SaveReplay> {
    context;
    await this.gameService.saveReplay(userId, userVocal);
    return {
      replayId: 1,
      status: 200,
      message: "success",
    };
  }
}
