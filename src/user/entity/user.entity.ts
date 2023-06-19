import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ type: 'varchar', length: 30 })
  userEmail: string;

  @Column({ type: 'varchar', length: 16 })
  password: string;

  @Column({ type: 'varchar', length: 24 })
  nickName: string;

  @Column({ type: 'tinyint', default: 0 })
  userActive: boolean;

  @Column({ type: 'tinyint', default: 0 })
  userKeynote: boolean;

  @Column({ type: 'smallint', default: 0 })
  userMmr: number;

  @Column({ type: 'mediumint', default: 0 })
  userPoint: number;

  @Column({ type: 'varchar', length: 1024 })
  mainCharacter: string;

  @Column({ type: 'datetime', nullable: true })
  deletedAt: Date;
}
