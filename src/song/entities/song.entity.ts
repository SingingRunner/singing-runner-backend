import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Song {
  @PrimaryGeneratedColumn("uuid")
  songId: number;

  @Column()
  songTitle: string;

  @Column()
  singer: string;

  @Column()
  songLyrics: string;

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
