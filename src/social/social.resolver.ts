import { AddFriendDto } from "./dto/add-friend.dto";
import { SocialService } from "./social.service";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FriendDto } from "src/user/dto/friend.dto";
import { HostUserDto } from "src/user/dto/host-user.dto";
import { PollingDto } from "./dto/polling.dto";
import { NotificationDto } from "./dto/notification.dto";
import { RequestDto } from "./dto/request-dto";
import { SearchFriendDto } from "src/user/dto/search-freind.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

@Resolver()
export class SocialResolver {
  constructor(private socialService: SocialService) {}

  @Mutation(() => PollingDto)
  async longPolling(@Args("userId") userId: string) {
    if (userId.length < 10) {
      throw new HttpException("Empty userID", HttpStatus.BAD_REQUEST);
    }
    this.socialService.setHeartBeat(userId, Date.now());
    await this.socialService.delay(3000);
    let pollingDto: PollingDto = await this.socialService.checkWhilePolling(
      userId
    );

    if (
      pollingDto.hostUserDtoList.length !== 0 ||
      pollingDto.userNotificationList.length !== 0
    ) {
      return pollingDto;
    }

    await this.socialService.delay(3000);

    pollingDto = await this.socialService.checkWhilePolling(userId);

    return pollingDto;
  }

  @Query(() => [RequestDto])
  async getNotification(
    @Args("userId") userId: string,
    @Args("page", { type: () => Int }) page: number
  ) {
    try {
      const notifications = await this.socialService.getNotifications(
        userId,
        page
      );
      return this.socialService.getRequestDto(notifications);
    } catch (error) {
      console.error(error);
      throw new Error("알림을 불러오는데 실패했습니다." + error.message);
    }
  }

  @Query(() => [SearchFriendDto])
  async searchFriend(
    @Args("userId") userId: string,
    @Args("nickname") nickname: string,
    @Args("page", { type: () => Int }) page: number
  ): Promise<SearchFriendDto[]> {
    try {
      return await this.socialService.searchFriend(userId, nickname, page);
    } catch (error) {
      console.error(error);
      throw new Error("친구를 검색하는데 실패했습니다." + error.message);
    }
  }

  @Query(() => [FriendDto])
  async searchUser(
    @Args("userId") userId: string,
    @Args("nickname") nickname: string,
    @Args("page", { type: () => Int }) page: number
  ): Promise<FriendDto[]> {
    try {
      return await this.socialService.searchUser(userId, nickname, page);
    } catch (error) {
      console.error(error);
      throw new Error("유저를 검색하는데 실패했습니다." + error.message);
    }
  }

  @Mutation(() => String)
  async addFriend(@Args("addFriendDto") addFriendDto: AddFriendDto) {
    try {
      await this.socialService.addFriend(
        addFriendDto.userId,
        addFriendDto.friendId
      );
      return "친구추가 성공";
    } catch (error) {
      console.error(error);
      throw new Error("친구추가에 실패했습니다." + error.message);
    }
  }

  @Mutation(() => String)
  async removeFriend(@Args("addFriendDto") addFriendDto: AddFriendDto) {
    try {
      const date = new Date();
      await this.socialService.removeFriend(
        addFriendDto.userId,
        addFriendDto.friendId,
        date
      );
      return "친구삭제 성공";
    } catch (error) {
      console.error(error);
      throw new Error("친구삭제에 실패했습니다." + error.message);
    }
  }

  @Mutation(() => String)
  async inviteFriend(
    @Args("friendId") friendId: string,
    @Args("hostUserDto") hostUserDto: HostUserDto
  ) {
    try {
      this.socialService.inviteFriend(friendId, hostUserDto);
      return "친구초대 성공";
    } catch (error) {
      console.error(error);
      throw new Error("친구초대에 실패했습니다." + error.message);
    }
  }

  @Mutation(() => String)
  async friendRequest(
    @Args("notificationDto") notificationDto: NotificationDto
  ) {
    try {
      this.socialService.friendRequest(
        notificationDto.userId,
        notificationDto.senderId,
        new Date()
      );
      return "친구요청 성공";
    } catch (error) {
      console.error(error);
      throw new Error("친구요청에 실패했습니다." + error.message);
    }
  }

  @Mutation(() => String)
  async deleteNotification(
    @Args("notificationDto") notificationDto: NotificationDto
  ) {
    try {
      this.socialService.deleteNotification(
        notificationDto.userId,
        notificationDto.senderId,
        new Date()
      );
      return "알림삭제 성공";
    } catch (error) {
      console.error(error);
      throw new Error("알림삭제에 실패했습니다." + error.message);
    }
  }
}
