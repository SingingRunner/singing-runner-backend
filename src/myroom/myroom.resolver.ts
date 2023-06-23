import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "src/user/user.service";
import { AuthService } from "src/auth/auth.service";
import { MyroomService } from "./myroom.service";
import { characterEnum } from "src/user/util/character.enum";
import { UserCharacterResponseDto } from "src/user/dto/user.character.response.dto";
import { UserKeynoteResponseDto } from "src/user/dto/user.keynote.response.dto";
import { userKeynoteStatus } from "src/user/util/user.enum";
import { GameReplayService } from "src/game/replay/game.replay.service";
import { ReplayWithSongInfo } from "src/game/replay/dto/replay-with-song-info.dto";
import { ReplayIsPublicResponseDto } from "src/game/replay/dto/replay-ispublic-response.dto";

@Resolver()
export class MyroomResolver {
  constructor(
    private myroomService: MyroomService,
    private userService: UserService,
    private authService: AuthService,
    private gameReplayService: GameReplayService
  ) {}

  @Mutation(() => String)
  async logout(@Args("userId") userId: string): Promise<string> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("해당하는 유저가 없습니다.");
    }
    try {
      return await this.authService.logout(user);
    } catch (err) {
      throw new Error("로그아웃에 실패했습니다.");
    }
  }

  @Mutation(() => UserCharacterResponseDto)
  async updateCharacter(
    @Args("userId") userId: string,
    @Args("character") character: characterEnum
  ): Promise<UserCharacterResponseDto> {
    const updatedUser = await this.myroomService.updateCharacter(
      userId,
      character
    );
    return {
      userId: updatedUser.userId,
      character: updatedUser.character,
    };
  }

  @Mutation(() => UserKeynoteResponseDto)
  async updateUserKeynote(
    @Args("userId") userId: string,
    @Args("keynote", { type: () => userKeynoteStatus })
    keynote: userKeynoteStatus
  ): Promise<UserKeynoteResponseDto> {
    const updatedUser = await this.myroomService.updateUserKeynote(
      userId,
      keynote
    );
    return {
      userId: updatedUser.userId,
      userKeynote: updatedUser.userKeynote,
    };
  }

  @Query(() => [ReplayWithSongInfo])
  async getUserReplays(
    @Args("isMyReplay", { type: () => Boolean }) isMyReplay: boolean,
    @Args("pageNumber", { type: () => Int }) pageNumber: number,
    @Args("userId") userId: string
  ): Promise<ReplayWithSongInfo[]> {
    return await this.gameReplayService.getUserReplays(
      isMyReplay,
      pageNumber,
      userId
    );
  }

  @Mutation(() => ReplayIsPublicResponseDto)
  async updateReplayIsPublic(
    @Args("replayId") replayId: number,
    @Args("isPublic", { type: () => Int }) isPublic: number
  ): Promise<ReplayIsPublicResponseDto> {
    const updatedReplay = await this.gameReplayService.updateReplayIsPublic(
      replayId,
      isPublic
    );
    return {
      replayId: updatedReplay.replayId,
      isPublic: updatedReplay.isPublic,
    };
  }
}
