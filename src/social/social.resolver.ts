import { Query } from "@nestjs/common";
import { AddFriendDto } from "./dto/add-friend.dto";
import { SocialService } from "./social.service";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "src/user/entity/user.entity";
import { FriendDto } from "src/user/dto/friend.dto";

@Resolver()
export class SocialResolver {
  /**
   * 친구추가(mutation)
   * 친구삭제(mutation)
   * 친구검색(mutation)
   * 유저전체검색(mutation)
   * 친구목록조회(query)
   */

  constructor(private socialService: SocialService) {}

  @Mutation()
  async addFriend(@Args("addFriendDto") addFriendDto: AddFriendDto) {
    this.socialService.addFriend(addFriendDto.userId, addFriendDto.firendId);
  }

  @Mutation()
  async removeFriend(@Args("addFriendDto") addFriendDto: AddFriendDto) {
    const date = new Date();
    this.socialService.removeFriend(
      addFriendDto.userId,
      addFriendDto.firendId,
      date
    );
  }

  @Mutation(() => [User])
  async searchFriend(@Args("addFriendDto") addFriendDto: AddFriendDto) {
    return await this.socialService.searchFriend(
      addFriendDto.userId,
      addFriendDto.firendId,
      10
    );
  }

  @Mutation(() => [FriendDto])
  async searchUser(
    @Args("nickname") nickname: string,
    @Args("page") page: number
  ) {
    return await this.socialService.searchUser(nickname, page);
  }
}
