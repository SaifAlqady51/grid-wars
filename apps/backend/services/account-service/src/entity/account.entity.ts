import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username', type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    name: 'profile_image',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  profileImage: string;

  @Column({ name: 'wins', type: 'int', default: 0 })
  wins: number;

  @Column({ name: 'losses', type: 'int', default: 0 })
  losses: number;

  @Column({ name: 'draws', type: 'int', default: 0 })
  draws: number;

  @Column({ name: 'total_games', type: 'int', default: 0 })
  totalGames: number;

  @Column({ name: 'level', type: 'int', default: 1 })
  level: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'streak_days', type: 'int', default: 0 })
  streakDays: number;
}
