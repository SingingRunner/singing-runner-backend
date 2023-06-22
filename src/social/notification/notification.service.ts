import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserNotification } from "./user.notification.entitiy";
import { User } from "src/user/entity/user.entity";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>
  ) {}

  public async addNotification(user: User, sender: User, date: Date) {
    const notification = new UserNotification();
    notification.user = user;
    notification.sender = sender;
    notification.receivedAt = date;
    notification.content = "친구요청";
    console.log(notification);
    await this.userNotificationRepository.save(notification);
  }

  public async removeNotification(
    userId: string,
    senderId: string,
    date: Date
  ) {
    const notification = await this.userNotificationRepository.findOne({
      where: [{ userId: userId }, { senderId: senderId }],
    });

    if (!notification) {
      throw new Error("해당 친구 관계가 존재하지 않습니다.");
    }

    notification.deletedAt = date;
    await this.userNotificationRepository.save(notification);
  }

  public async getNotifications(
    userId: string,
    page: number
  ): Promise<UserNotification[]> {
    const take = 10;
    const skip = (page - 1) * take;
    const notDeleted = new Date("1970-01-01");
    const searchResult: UserNotification[] =
      await this.userNotificationRepository.find({
        where: [{ userId: userId }, { deletedAt: notDeleted }],
        take: take,
        skip: skip,
        order: { receivedAt: "DESC" },
      });
    return searchResult;
  }

  public async hasNotification(userId: string): Promise<boolean> {
    const notDeleted = new Date("1970-01-01");
    const notification: UserNotification | null =
      await this.userNotificationRepository.findOne({
        where: [{ userId: userId }, { deletedAt: notDeleted }],
      });
    if (!notification) {
      return false;
    }
    return true;
  }
}
