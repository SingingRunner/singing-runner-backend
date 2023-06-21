import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { characterEnum } from "../util/character.enum";
import { Field, ObjectType } from "@nestjs/graphql";

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
  @Column({ type: "varchar", length: 64 })
  password: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 24 })
  nickname: string;

  @Field(() => Boolean)
  @Column({ type: "tinyint", default: 0 })
  userActive: boolean;

  @Field(() => Boolean)
  @Column({ type: "tinyint", default: 0 })
  userKeynote: boolean;

  @Field(() => Number)
  @Column({ type: "smallint", default: 0 })
  userMmr: number;

  @Field(() => Number)
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
  refreshToken?: string;
}
