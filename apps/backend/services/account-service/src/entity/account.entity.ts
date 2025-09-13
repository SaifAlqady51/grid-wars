import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('accounts')
export class Account {
  @ApiProperty({
    description: 'Unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Username (3-50 characters)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 50,
  })
  @Column({ name: 'username', type: 'varchar', length: 50, nullable: false })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
    required: true,
    nullable: false,
  })
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

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @Column({
    name: 'profile_image',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  profileImage: string;

  @ApiProperty({
    description: 'Number of wins',
    example: 5,
    default: 0,
  })
  @Column({ name: 'wins', type: 'int', default: 0 })
  wins: number;

  @ApiProperty({
    description: 'Number of losses',
    example: 3,
    default: 0,
  })
  @Column({ name: 'losses', type: 'int', default: 0 })
  losses: number;

  @ApiProperty({
    description: 'Number of draws',
    example: 2,
    default: 0,
  })
  @Column({ name: 'draws', type: 'int', default: 0 })
  draws: number;

  @ApiProperty({
    description: 'Total games played',
    example: 10,
    default: 0,
  })
  @Column({ name: 'total_games', type: 'int', default: 0 })
  totalGames: number;

  @ApiProperty({
    description: 'Account level',
    example: 5,
    default: 1,
  })
  @Column({ name: 'level', type: 'int', default: 1 })
  level: number;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Account last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Whether the account is active',
    example: true,
    default: true,
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Current streak days',
    example: 7,
    default: 0,
  })
  @Column({ name: 'streak_days', type: 'int', default: 0 })
  streakDays: number;
}
