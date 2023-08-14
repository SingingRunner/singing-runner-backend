import {
  Args,
  Int,
  Field,
  Mutation,
  Resolver,
  ObjectType,
  Query,
} from "@nestjs/graphql";
import { GameService } from "./game.service";
import { GameReplayService } from "./replay/game.replay.service";
import { UseGuards } from "@nestjs/common";
import { GqlAuthAccessGuard } from "src/auth/security/auth.guard";
import { ReplayInfoDto } from "./replay/dto/replay-info.dto";

@ObjectType()
class Replay {
  @Field(() => String)
  message: string;

  @Field(() => Int)
  code: number;
}

@Resolver()
export class GameResolver {
  constructor(
    private gameService: GameService,
    private gameReplayService: GameReplayService
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Replay)
  async saveReplay(
    @Args({ name: "userVocal", type: () => String })
    userVocal: string,
    @Args({ name: "userId", type: () => String }) userId: string
  ): Promise<Replay> {
    await this.gameService.saveReplay(userId, userVocal);
    return {
      message: "성공적으로 저장되었습니다.",
      code: 200,
    };
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Query(() => ReplayInfoDto)
  async playReplay(@Args("replayId", { type: () => Int }) replayId: number) {
    console.log(replayId);
    try {
      const replay = await this.gameReplayService.getReplayInfo(replayId);
      console.log(replay);
      return replay;
    } catch (error) {
      console.log(error);
    }
  }
}
