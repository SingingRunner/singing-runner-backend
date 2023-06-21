import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

@Entity("social")
export class Social {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  friendId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "friendId" })
  friend: User;

  @Column({ type: "datetime" })
  deletedAt: number;
}
