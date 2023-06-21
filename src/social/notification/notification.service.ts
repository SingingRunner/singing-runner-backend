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
}
