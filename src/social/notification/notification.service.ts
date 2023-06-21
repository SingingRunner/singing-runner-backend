import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { UserNotification } from "./user.notification.entitiy";

@Injectable()
export class Notification {
  constructor(
    private userService: UserService,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>
  ) {}

  public async addNotification(userId: string, senderId: string) {
    const user = await this.userService.findUserById(userId);
    const sender = await this.userService.findUserById(senderId);
    if (user === null || sender === null) {
      throw new Error("등록되지 않은 유저 또는 친구입니다");
    }
    const notification = new UserNotification();
    notification.user = user;
    notification.sender = sender;

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
}
