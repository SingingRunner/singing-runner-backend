import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { characterEnum } from "../util/character.enum";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ type: "varchar", length: 30 })
  userEmail: string;

  @Column({ type: "varchar", length: 64 })
  password: string;

  @Column({ type: "varchar", length: 24 })
  nickname: string;

  @Column({ type: "tinyint", default: 0 })
  userActive: boolean;

  @Column({ type: "tinyint", default: 0 })
  userKeynote: boolean;

  @Column({ type: "smallint", default: 0 })
  userMmr: number;

  @Column({ type: "mediumint", default: 0 })
  userPoint: number;

  @Column({ type: "enum", enum: characterEnum, default: characterEnum.BELUGA })
  character: characterEnum;

  @Column({ type: "datetime", nullable: true })
  deletedAt: Date;
}
