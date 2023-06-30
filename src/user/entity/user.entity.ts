import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { characterEnum } from "../util/character.enum";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { GameReplayEntity } from "src/game/replay/entity/game.replay.entity";

@ObjectType()
@Entity("user")
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 30 })
  userEmail: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 64, default: "" })
  password: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 24 })
  nickname: string;

  @Field(() => Int)
  @Column({ type: "tinyint", default: 0 })
  userActive: number;

  @Field(() => Int)
  @Column({ type: "tinyint", default: 0 })
  userKeynote: number;

  @Field(() => Int)
  @Column({ type: "smallint", default: 0 })
  userMmr: number;

  @Field(() => Int)
  @Column({ type: "mediumint", default: 0 })
  userPoint: number;

  @Field(() => String)
  @Column({ type: "enum", enum: characterEnum, default: characterEnum.BELUGA })
  character: characterEnum;

  @Field(() => Date, { nullable: true })
  @Column({ type: "datetime", nullable: true })
  deletedAt: Date;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 255, nullable: true })
  refreshToken?: string | null;

  @OneToMany(
    () => GameReplayEntity,
    (gameReplayEntity) => gameReplayEntity.user
  )
  replays: GameReplayEntity[];
}
