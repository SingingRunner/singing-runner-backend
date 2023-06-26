import { AddFriendDto } from "./dto/add-friend.dto";
import { SocialService } from "./social.service";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FriendDto } from "src/user/dto/friend.dto";
import { HostUserDto } from "src/user/dto/host-user.dto";
import { PollingDto } from "./dto/polling.dto";
import { NotificationDto } from "./dto/notification.dto";
import { RequestDto } from "./dto/request-dto";
import { SearchFriendDto } from "src/user/dto/search-freind.dto";

@Resolver()
export class SocialResolver {
  constructor(private socialService: SocialService) {}

  @Mutation(() => PollingDto)
  async longPolling(@Args("userId") userId: string) {
    console.log("userId", userId);
    console.log("pooing");
    console.log("polling recieive :", Date.now());
    this.socialService.setHeartBeat(userId, Date.now());
    await this.socialService.delay(10000);
    console.log("첫딜레이 이후:", Date.now());
    let pollingDto: PollingDto = await this.socialService.checkWhilePolling(
      userId
    );

    if (
      pollingDto.hostUserDtoList.length !== 0 ||
      pollingDto.userNotificationList.length !== 0
    ) {

      console.log(" 5초 대기후 반환");
      return pollingDto;
    }

    await this.socialService.delay(10000);
    console.log("두번쨰 딜레이 이후:", Date.now());

    pollingDto = await this.socialService.checkWhilePolling(userId);
    console.log("10초 대기 후 반환");

    return pollingDto;
  }

  @Query(() => [RequestDto])
  async getNotification(
    @Args("userId") userId: string,
    @Args("page", { type: () => Int }) page: number
  ) {
    const notifications = await this.socialService.getNotifications(
      userId,
      page
    );

    return this.socialService.getRequestDto(notifications);
  }

  @Query(() => [SearchFriendDto])
  async searchFriend(
    @Args("userId") userId: string,
    @Args("nickname") nickname: string,
    @Args("page", { type: () => Int }) page: number
  ): Promise<SearchFriendDto[]> {
    return await this.socialService.searchFriend(userId, nickname, page);
  }

  @Query(() => [FriendDto])
  async searchUser(
    @Args("userId") userId: string,
    @Args("nickname") nickname: string,
    @Args("page", { type: () => Int }) page: number
  ): Promise<FriendDto[]> {
    return await this.socialService.searchUser(userId, nickname, page);
  }

  @Mutation(() => String)
  async addFriend(@Args("addFriendDto") addFriendDto: AddFriendDto) {
    await this.socialService.addFriend(
      addFriendDto.userId,
      addFriendDto.friendId
    );
    return "ok";
  }

  @Mutation(() => String)
  async removeFriend(@Args("addFriendDto") addFriendDto: AddFriendDto) {
    const date = new Date();
    await this.socialService.removeFriend(
      addFriendDto.userId,
      addFriendDto.friendId,
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
