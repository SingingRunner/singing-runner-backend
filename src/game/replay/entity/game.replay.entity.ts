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

  @Column({ type: "tinyint", default: 0 })
  keynote: number;

  @ManyToOne(() => User)
  userId: string;

  @Column({ type: "varchar", length: 1024 })
  userCharacter: string;

  @ManyToOne(() => User)
  player1Id: string;

  @Column({ type: "varchar", length: 1024 })
  player1Character: string;

  @ManyToOne(() => User)
  player2Id: string;

  @Column({ type: "varchar", length: 1024 })
  player2Character: string;

  @ManyToOne(() => Song)
  songId: number;
}
