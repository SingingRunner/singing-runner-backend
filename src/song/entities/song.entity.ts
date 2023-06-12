import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn('uuid')
  songId: Int16Array;

  @Column()
  songTitle: string;

  @Column()
  singer: string;

  @Column()
  song_lylics: string;

  @Column()
  song_file: string;

  @Column()
  song_gender: boolean;

  @Column()
  song_male: string;

  @Column()
  song_male_up: string;

  @Column()
  song_male_down: string;

  @Column()
  song_female: string;

  @Column()
  song_female_up: string;

  @Column()
  song_female_down: string;

  @Column()
  vocal_male: string;

  @Column()
  vocal_male_up: string;

  @Column()
  vocal_male_down: string;

  @Column()
  vocal_female: string;

  @Column()
  vocal_female_up: string;

  @Column()
  vocal_female_down: string;

  @Column()
  created_at: Date;
}
