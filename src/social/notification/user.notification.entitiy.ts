import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

@Entity("user_notification")
export class UserNotification {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "friendId" })
  sender: User;

  @Column({ type: "varchar" })
  content: string;

  @Column({ type: "datetime" })
  receivedAt: Date;

  @Column({ type: "datetime", default: "1970-01-01" })
  deletedAt: Date;
}
