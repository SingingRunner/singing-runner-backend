import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity("user_notification")
export class UserNotification {
  @PrimaryColumn()
  @Field(() => String)
  userId: string;

  @PrimaryColumn()
  @Field(() => String)
  senderId: string;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Field()
  @ManyToOne(() => User)
  @JoinColumn({ name: "friendId" })
  sender: User;

  @Field(() => String)
  @Column({ type: "varchar" })
  content: string;

  @Field(() => Date)
  @Column({ type: "datetime" })
  receivedAt: Date;

  @Field(() => Date)
  @Column({ type: "datetime", default: "1970-01-01" })
  deletedAt: Date;
}
