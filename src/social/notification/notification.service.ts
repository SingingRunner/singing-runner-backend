import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { UserNotification } from "./user.notification.entitiy";
import { User } from "src/user/entity/user.entity";
import { Subject } from "rxjs";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>
  ) {}
  private evnetsMap: Map<string, Subject<{ alarm: boolean }>> = new Map();
  private notificationMap: Map<string, boolean> = new Map();
  public async addNotification(user: User, sender: User, date: Date) {
    const notification = new UserNotification();
    notification.user = user;
    notification.sender = sender;
    notification.content = "친구요청";
    this.getEvent(user.userId).next({
      alarm: true,
    });
    console.log("get notifi event");
    notification.receivedAt = date;
    notification.deletedAt = null;
    await this.userNotificationRepository.save(notification);
  }

  public async removeNotification(
    userId: string,
    senderId: string,
    date: Date
  ) {
    const notification = await this.userNotificationRepository.findOne({
      where: [{ userId: userId, senderId: senderId }],
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
    const searchResult: UserNotification[] =
      await this.userNotificationRepository.find({
        where: [{ userId: userId, deletedAt: IsNull() }],
        take: take,
        skip: skip,
        relations: ["sender"],
        order: { receivedAt: "DESC" },
      });
    return searchResult;
  }

  public async hasNotification(userId: string): Promise<boolean> {
    const notification: UserNotification | null =
      await this.userNotificationRepository.findOne({
        where: [{ userId: userId, deletedAt: IsNull() }],
      });
    if (!notification) {
      return false;
    }
    return true;
  }

  public setNotificationMap(userId: string) {
    this.notificationMap.set(userId, true);
  }

  public notificationEvents(userId: string): Subject<{ alarm: boolean }> {
    return this.getEvent(userId);
  }

  public getEvent(userId: string): Subject<{ alarm: boolean }> {
    let notification = this.evnetsMap.get(userId);
    if (this.notificationMap.has(userId)) {
      this.evnetsMap.set(userId, new Subject());
      this.evnetsMap.get(userId)?.next({
        alarm: true,
      });
      this.notificationMap.delete(userId);
    }
    if (notification === undefined) {
      this.evnetsMap.set(userId, new Subject());
      notification = this.evnetsMap.get(userId)!;
    }
    return notification;
  }
}
