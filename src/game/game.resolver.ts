import {
  Args,
  Int,
  Field,
  Mutation,
  Resolver,
  ObjectType,
} from "@nestjs/graphql";
import { GameService } from "./game.service";
import { GameReplayService } from "./replay/game.replay.service";
import { UseGuards } from "@nestjs/common";
import { GqlAuthAccessGuard } from "src/auth/security/auth.guard";

@ObjectType()
class Reply {
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
  @Mutation(() => Reply)
  async saveReplay(
    @Args({ name: "userVocal", type: () => String })
    userVocal: string,
    @Args({ name: "userId", type: () => String }) userId: string
  ): Promise<Reply> {
    await this.gameService.saveReplay(userId, userVocal);
    return {
      message: "성공적으로 저장되었습니다.",
      code: 200,
    };
  }
}
