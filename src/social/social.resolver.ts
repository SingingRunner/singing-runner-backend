import { AddFriendDto } from "./dto/add-friend.dto";
import { SocialService } from "./social.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "src/user/entity/user.entity";
import { FriendDto } from "src/user/dto/friend.dto";
import { HostUserDto } from "src/user/dto/host-user.dto";

@Resolver()
export class SocialResolver {
  constructor(private socialService: SocialService) {}

  @Query(() => [User])
  async searchFriend(
    @Args("addFriendDto") addFriendDto: AddFriendDto
  ): Promise<User[]> {
    return await this.socialService.searchFriend(
      addFriendDto.userId,
      addFriendDto.firendId,
      10
    );
  }

  @Query(() => [FriendDto])
  async searchUser(
    @Args("nickname") nickname: string,
    @Args("page") page: number
  ): Promise<FriendDto[]> {
    return await this.socialService.searchUser(nickname, page);
  }

  @Query(() => [FriendDto])
  async getFriendList(
    @Args("userId") userId: string,
    @Args("page") page: number
  ): Promise<FriendDto[]> {
    return await this.socialService.getFriendList(userId, page);
  }

  @Mutation(() => String)
  async addFriend(@Args("addFriendDto") addFriendDto: AddFriendDto) {
    await this.socialService.addFriend(
      addFriendDto.userId,
      addFriendDto.firendId
    );
    return "ok";
  }

  @Mutation(() => String)
  async removeFriend(@Args("addFriendDto") addFriendDto: AddFriendDto) {
    const date = new Date();
    await this.socialService.removeFriend(
      addFriendDto.userId,
      addFriendDto.firendId,
      date
    );
    return "ok";
  }

  @Mutation(() => String)
  async inviteFriend(
    @Args("friendId") friendId: string,
    @Args("hostUserDto") hostUserDto: HostUserDto
  ) {
    this.socialService.inviteFriend(friendId, hostUserDto);
    return "ok";
  }

  @Mutation(() => String)
  async friendRequest(userId: string, senderId: string) {
    this.socialService.friendRequest(userId, senderId, new Date());
    return "ok";
  }

  @Mutation(() => String)
  async deleteNotification(userId: string, senderId: string) {
    this.socialService.deleteNotification(userId, senderId, new Date());
    return "ok";
  }
}
