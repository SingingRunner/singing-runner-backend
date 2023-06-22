import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { Social } from "./entity/social.entity";
import { Repository } from "typeorm";
import { NotificationService } from "./notification/notification.service";
import { FriendDto } from "src/user/dto/friend.dto";
import { UserMatchTier } from "src/game/utill/game.enum";

@Injectable()
export class SocialService {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    @InjectRepository(Social)
    private readonly socialRepository: Repository<Social>
  ) {}

  public async addFriend(userId: string, friendId: string) {
    const user = await this.userService.findUserById(userId);
    const friend = await this.userService.findUserById(friendId);
    if (user === null || friend === null) {
      throw new Error("등록되지 않은 유저 또는 친구입니다");
    }
    const social = new Social();
    social.user = user;
    social.friend = friend;

    await this.socialRepository.save(social);
  }

  public async removeFriend(userId: string, friendId: string, date: Date) {
    const social = await this.socialRepository.findOne({
      where: [{ userId: userId }, { friendId: friendId }],
    });

    if (!social) {
      throw new Error("해당 친구 관계가 존재하지 않습니다.");
    }
    social.deletedAt = date;
    await this.socialRepository.save(social);
  }

  public async getFriendList(
    userId: string,
    page: number
  ): Promise<FriendDto[]> {
    const take = 10;
    const skip = (page - 1) * take;
    const notDeleted = new Date("1970-01-01");
    const socialList = await this.socialRepository.find({
      where: [{ userId: userId }, { deletedAt: notDeleted }],
      take: take,
      skip: skip,
    });
    const userTier = UserMatchTier.BRONZE;
    const friendList: FriendDto[] = [];
    for (const social of socialList) {
      friendList.push(
        new FriendDto(
          social.friend.userId,
          social.friend.nickname,
          social.friend.userActive,
          social.friend.character,
          social.friend.userMmr,
          userTier
        )
      );
    }
    return friendList;
  }

  public async friendRequest(userId: string, senderId: string, date: Date) {
    this.notificationService.addNotification(userId, senderId, date);
  }
}
