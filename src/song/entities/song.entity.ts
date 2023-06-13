import { PartialType } from '@nestjs/mapped-types';
import { UserMatchDto } from 'src/user/dto/user.match.dto';
import { userKeynoteStatus } from 'src/user/util/user.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  songId: number;

  @Column()
  songTitle: string;

  @Column()
  singer: string;

  @Column()
  songLyrics: string;

  @Column()
  songFile: string;

  @Column()
  songGender: boolean;

  @Column()
  songMale: string;

  @Column()
  songMaleUp: string;

  @Column()
  songMaleDown: string;

  @Column()
  songFemale: string;

  @Column()
  songFemaleUp: string;

  @Column()
  songFemaleDown: string;

  @Column()
  vocalMale: string;

  @Column()
  vocalMaleUp: string;

  @Column()
  vocalMaleDown: string;

  @Column()
  vocalFemale: string;

  @Column()
  vocalFemaleUp: string;

  @Column()
  vocalFemaleDown: string;

  @Column()
  createdAt: Date;
}

@Entity()
export class User extends PartialType(UserMatchDto) {
  @PrimaryGeneratedColumn()
  uerKeynote: userKeynoteStatus;
}
