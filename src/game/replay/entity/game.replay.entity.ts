import { User } from "src/auth/user/entity/user.entity";
import { Song } from "src/song/entities/song.entity";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class GameReplayEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  replayId: number;

  @Column({ type: "varchar", length: 1024 })
  userVocal: string;

  @Column({ type: "varchar", length: 1024 })
  gameEvent: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "datetime", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User)
  userId: string;

  @ManyToOne(() => Song)
  songId: number;
}
