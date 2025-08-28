import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
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
  @Exclude() // Exclude from serialization
  passwordHash: string;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  displayName: string;

  @Column({
    name: 'wins',
    type: 'int',
    default: 0,
  })
  wins: number;

  @Column({
    name: 'losses',
    type: 'int',
    default: 0,
  })
  losses: number;

  @Column({
    name: 'draws',
    type: 'int',
    default: 0,
  })
  draws: number;

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

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'streak_days',
    type: 'int',
    default: 0,
  })
  streakDays: number;

  // Virtual property for total games
  get totalGames(): number {
    return this.wins + this.losses + this.draws;
  }

  // Virtual property for win rate
  get winRate(): number {
    if (this.totalGames === 0) return 0;
    return (this.wins / this.totalGames) * 100;
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateTimestamps(): void {
    this.updatedAt = new Date();
  }

  // Helper method to update stats
  updateStats(result: 'win' | 'loss' | 'draw'): void {
    switch (result) {
      case 'win':
        this.wins += 1;
        break;
      case 'loss':
        this.losses += 1;
        break;
      case 'draw':
        this.draws += 1;
        break;
    }
  }

  // Helper method to reset stats
  resetStats(): void {
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
    this.streakDays = 0;
  }
}
