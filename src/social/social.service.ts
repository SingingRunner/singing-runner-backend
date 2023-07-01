import { HeartBeat } from "src/social/heartbeat/hearbeat";
import { HostUserDto } from "src/user/dto/host-user.dto";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { Social } from "./entity/social.entity";
import { IsNull, Repository } from "typeorm";
import { NotificationService } from "./notification/notification.service";
import { FriendDto } from "src/user/dto/friend.dto";
import { User } from "src/user/entity/user.entity";
import { Invite } from "./invite/invite";
import { UserNotification } from "./notification/user.notification.entitiy";
import { RequestDto } from "./dto/request-dto";
import { SearchFriendDto } from "src/user/dto/search-freind.dto";
import { Subject } from "rxjs";

@Injectable()
export class SocialService {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    @InjectRepository(Social)
    private readonly socialRepository: Repository<Social>,
    @Inject("HeartBeat")
    private hearBeat: HeartBeat,
    private invite: Invite
  ) {}

  public inviteEvents(
    userId: string
  ): Subject<{ userId: string; host: HostUserDto }> {
    return this.invite.inviteEvents(userId);
  }

  public async addFriend(userId: string, friendId: string) {
    const user = await this.userService.findUserById(userId);
    const friend = await this.userService.findUserById(friendId);
    if (user === null || friend === null) {
      throw new Error("등록되지 않은 유저 입니다");
    }

    const [userToFriend, friendToUser] = await Promise.all([
      this.socialRepository
        .createQueryBuilder("social")
        .where("social.userId = :userId", { userId })
        .andWhere("social.friendId = :friendId", { friendId })
        .getOne(),
      this.socialRepository
        .createQueryBuilder("social")
        .where("social.userId = :userId", { userId: friendId })
        .andWhere("social.friendId = :friendId", { friendId: userId })
        .getOne(),
    ]);

    if (!userToFriend || !friendToUser) {
      const social = new Social();
      social.user = user;
      social.friend = friend;
      await this.socialRepository.save(social);

      social.user = friend;
      social.friend = user;
      await this.socialRepository.save(social);
    } else {
      userToFriend.deletedAt = null;
      friendToUser.deletedAt = null;
      await this.socialRepository.save(userToFriend);
      await this.socialRepository.save(friendToUser);
    }
  }

  public async removeFriend(userId: string, friendId: string, date: Date) {
    const [userToFriend, friendToUser] = await Promise.all([
      this.socialRepository
        .createQueryBuilder("social")
        .where("social.userId = :userId", { userId })
        .andWhere("social.friendId = :friendId", { friendId })
        .getOne(),
      this.socialRepository
        .createQueryBuilder("social")
        .where("social.userId = :userId", { userId: friendId })
        .andWhere("social.friendId = :friendId", { friendId: userId })
        .getOne(),
    ]);

    if (!userToFriend || !friendToUser) {
      throw new Error("해당 친구 관계가 존재하지 않습니다.");
    }

    userToFriend.deletedAt = date;
    friendToUser.deletedAt = date;

    await this.socialRepository.save(userToFriend);
    await this.socialRepository.save(friendToUser);
  }

  public async searchUser(
    userId: string,
    nickname: string,
    page: number
  ): Promise<FriendDto[]> {
    if (!nickname) {
      return []; // 빈 닉네임 제공 시, 빈 배열 반환(조회 X)
    }

    const take = 10;
    const skip = (page - 1) * take;

    // 유저의 친구 목록
    const friendList = await this.getFriendList(userId);
    const friendIds = friendList.map((user) => user.userId);

    // 친구 목록에 없고 별명과 일치하는 유저 찾는 옵션
    const users: User[] = await this.userService.findUserByNickname(
      userId,
      nickname
    );
    const filteredUsers: User[] = users
      .filter((user) => !friendIds.includes(user.userId))
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
      .addSelect(
        "IF(friend.userActive=2, 1, IF(friend.userActive=0, 2, IF(friend.userActive=1, 3, 4)))",
        "custom_order"
      )
      .orderBy("custom_order", "ASC")
      .addOrderBy("friend.nickname", "ASC")
      .skip(skip)
      .take(take)
      .getMany();

    const resultList: SearchFriendDto[] = [];
    for (const friend of friends) {
      const searchFriendDto = new SearchFriendDto();
      searchFriendDto.nickname = friend.friend.nickname;
      searchFriendDto.character = friend.friend.character;
      searchFriendDto.userActive = friend.friend.userActive;
      searchFriendDto.userId = friend.friend.userId;
      searchFriendDto.userMmr = friend.friend.userMmr;
      searchFriendDto.userTier = this.userService.determineUserTier(
        friend.friend.userMmr
      );
      resultList.push(searchFriendDto);
    }

    return resultList;
  }

  public async getFriendList(userId: string): Promise<User[]> {
    const socialList = await this.socialRepository.find({
      where: [{ userId: userId, deletedAt: IsNull() }],
      relations: ["friend"],
    });
    const friendList: User[] = [];

    for (const social of socialList) {
      friendList.push(social.friend);
    }

    return friendList;
  }

  public async friendRequest(userId: string, senderId: string, date: Date) {
    const [user, sender] = await Promise.all([
      this.userService.findUserById(userId),
      this.userService.findUserById(senderId),
    ]);

    if (user === null || sender === null) {
      throw new Error("등록되지 않은 유저 또는 친구입니다");
    }
    if (!this.hearBeat.isLoginUser(userId)) {
      this.notificationService.setNotificationMap(userId);
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
        new RequestDto(
          notification.senderId,
          notification.sender.nickname,
          notification.receivedAt
        )
      );
    }
    return requestDtoList;
  }

  public delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
