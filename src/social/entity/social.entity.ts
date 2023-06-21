import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";

@Entity("social")
export class Social {
  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "friendId" })
  friend: User;

  @Column({ type: "datetime" })
  deletedAt: number;
}
