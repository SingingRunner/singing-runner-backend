import { AddFriendDto } from "./dto/add-friend.dto";
import { SocialService } from "./social.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "src/user/entity/user.entity";
import { FriendDto } from "src/user/dto/friend.dto";
import { HostUserDto } from "src/user/dto/host-user.dto";
import { PollingDto } from "./dto/polling.dto";
import { NotificationDto } from "./dto/notification.dto";
import { RequestDto } from "./dto/request-dto";

@Resolver()
export class SocialResolver {
  constructor(private socialService: SocialService) {}

  @Mutation(() => PollingDto)
  async longPolling(@Args("userId") userId: string) {
    let pollingDto: PollingDto = await this.socialService.checkWhilePolling(
      userId
    );

    if (pollingDto.hostUserDtoList || pollingDto.userNotificationList) {
      return pollingDto;
    }

    await this.socialService.delay(5000);
    pollingDto = await this.socialService.checkWhilePolling(userId);

    return pollingDto;
  }
  @Query(() => [RequestDto])
  async getNotification(
    @Args("userId") userId: string,
    @Args("page") page: number
  ) {
    const notifications = await this.socialService.getNotification(
      userId,
      page
    );
    const requestDtoList: RequestDto[] = [];
    for (const notification of notifications) {
      requestDtoList.push(
        new RequestDto(notification.senderId, notification.sender.nickname)
      );
    }
    return requestDtoList;
  }

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
  async friendRequest(
    @Args("notificationDto") notificationDto: NotificationDto
  ) {
    this.socialService.friendRequest(
      notificationDto.userId,
      notificationDto.senderId,
      new Date()
    );
    return "ok";
  }

  @Mutation(() => String)
  async deleteNotification(
    @Args("notificationDto") notificationDto: NotificationDto
  ) {
    this.socialService.deleteNotification(
      notificationDto.userId,
      notificationDto.senderId,
      new Date()
    );
    return "ok";
  }
}
