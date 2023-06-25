import { PollingDto } from "./dto/polling.dto";
import { HostUserDto } from "src/user/dto/host-user.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { Social } from "./entity/social.entity";
import { Repository } from "typeorm";
import { NotificationService } from "./notification/notification.service";
import { FriendDto } from "src/user/dto/friend.dto";
import { User } from "src/user/entity/user.entity";
import { Invite } from "./invite/invite";
import { UserNotification } from "./notification/user.notification.entitiy";
import { RequestDto } from "./dto/request-dto";
import { SearchFriendDto } from "src/user/dto/search-freind.dto";

@Injectable()
export class SocialService {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    @InjectRepository(Social)
    private readonly socialRepository: Repository<Social>,
    private invite: Invite
  ) {}

  public async checkWhilePolling(userId: string): Promise<PollingDto> {
    const pollingDto: PollingDto = new PollingDto();
    if (await this.hasInvitation(userId)) {
      pollingDto.hostUserDtoList = this.getAllInvitation(userId);
    }
    if (await this.hasNotification(userId)) {
      pollingDto.userNotificationList = await this.getNotifications(userId, 1);
    }
    return pollingDto;
  }

  public async addFriend(userId: string, friendId: string) {
    const user = await this.userService.findUserById(userId);
    const friend = await this.userService.findUserById(friendId);
    if (user === null || friend === null) {
      throw new Error("등록되지 않은 유저 입니다");
    }
    const social = new Social();
    social.user = user;
    social.friend = friend;
    await this.socialRepository.save(social);

    social.user = friend;
    social.friend = user;
    await this.socialRepository.save(social);
  }

  public async removeFriend(userId: string, friendId: string, date: Date) {
    const userToFriend = await this.socialRepository
      .createQueryBuilder("social")
      .where("social.userId = :userId", { userId })
      .andWhere("social.friendId = :friendId", { friendId })
      .getOne();

    const friendToUser = await this.socialRepository
      .createQueryBuilder("social")
      .where("social.userId = :userId", { userId: friendId })
      .andWhere("social.friendId = :friendId", { friendId: userId })
      .getOne();

    if (!userToFriend || !friendToUser) {
      throw new Error("해당 친구 관계가 존재하지 않습니다.");
    }

    userToFriend.deletedAt = date;
    friendToUser.deletedAt = date;

    await this.socialRepository.save(userToFriend);
    await this.socialRepository.save(friendToUser);
  }

  public async searchUser(
    nickname: string,
    page: number
  ): Promise<FriendDto[]> {
    if (!nickname) {
      return []; // 빈 닉네임 제공 시, 빈 배열 반환(조회 X)
    }

    const take = 10;
    const skip = (page - 1) * take;

    // 유저의 친구 목록
    const friendList = await this.getFriendList(nickname);

    // 친구 목록에 없고 별명과 일치하는 유저 찾는 옵션
    const users: User[] = await this.userService.findUserByNickname(nickname);
    const filteredUsers: User[] = users
      .filter((user) => !friendList.includes(user.userId))
      .slice(skip, skip + take);

    const userList: FriendDto[] = [];
    for (const user of filteredUsers) {
      const userTier = this.userService.determineUserTier(user.userMmr);

      userList.push(
        new FriendDto(
          user.userId,
          user.nickname,
          user.userActive,
          user.character,
          user.userMmr,
          userTier
        )
      );
    }
    return userList;
  }

  public async searchFriend(
    userId: string,
    nickname: string,
    page: number
  ): Promise<SearchFriendDto[]> {
    const take = 10;
    const skip = (page - 1) * take;

    const friends: Social[] = await this.socialRepository
      .createQueryBuilder("social")
      .innerJoinAndSelect("social.friend", "friend")
      .innerJoinAndSelect("social.user", "user")
      .where("social.userId = :userId", { userId })
      .andWhere("friend.nickname LIKE :nickname", {
        nickname: `%${nickname}%`,
      })
      .andWhere("social.deletedAt IS NULL")
      .orderBy("friend.nickname")
      .skip(skip)
      .take(take)
      .getMany();

    const friendList: User[] = friends.map((friend) => friend.friend);
    const resultList: SearchFriendDto[] = [];
    for (const friend of friendList) {
      const searchFriendDto = new SearchFriendDto();
      searchFriendDto.nickname = friend.nickname;
      searchFriendDto.character = friend.character;
      searchFriendDto.userActive = friend.userActive;
      searchFriendDto.userId = friend.userId;
      searchFriendDto.userMmr = friend.userMmr;
      searchFriendDto.userTier = this.userService.determineUserTier(
        friend.userMmr
      );
      resultList.push(searchFriendDto);
    }

    return resultList;
  }

  public async getFriendList(userId: string): Promise<string[]> {
    const socialList = await this.socialRepository.find({
      where: [{ userId: userId }],
      relations: ["friend"],
    });
    const friendList: string[] = [];

    for (const social of socialList) {
      friendList.push(social.friendId);
    }

    return friendList;
  }

  public async friendRequest(userId: string, senderId: string, date: Date) {
    const user: User | null = await this.userService.findUserById(userId);
    const sender: User | null = await this.userService.findUserById(senderId);
    if (user === null || sender === null) {
      throw new Error("등록되지 않은 유저 또는 친구입니다");
    }
    await this.notificationService.addNotification(user, sender, date);
  }

  public async deleteNotification(
    userId: string,
    senderId: string,
    date: Date
  ) {
    await this.notificationService.removeNotification(userId, senderId, date);
  }

  public inviteFriend(friendId: string, hostUserDto: HostUserDto) {
    this.invite.inviteFriend(friendId, hostUserDto);
  }

  private hasInvitation(userId: string): boolean {
    return this.invite.hasInvitation(userId);
  }

  private getAllInvitation(userId: string): HostUserDto[] {
    return this.getAllInvitation(userId);
  }

  public async getNotifications(
    userId: string,
    page: number
  ): Promise<UserNotification[]> {
    const notifications = await this.notificationService.getNotifications(
      userId,
      page
    );
    return notifications;
  }

  public getRequestDto(notifications: UserNotification[]): RequestDto[] {
    const requestDtoList: RequestDto[] = [];
    for (const notification of notifications) {
      requestDtoList.push(
        new RequestDto(notification.senderId, notification.sender.nickname)
      );
    }
    return requestDtoList;
  }

  public delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async hasNotification(userId: string): Promise<boolean> {
    return await this.hasNotification(userId);
  }
}
