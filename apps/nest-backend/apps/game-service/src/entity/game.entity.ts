import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Check,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum GameStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum GameMode {
  PVP = 'pvp',
  AI = 'ai',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum ResultType {
  WIN = 'win',
  DRAW = 'draw',
  FORFEIT = 'forfeit',
  TIMEOUT = 'timeout',
}

export enum Symbol {
  X = 'X',
  O = 'O',
}

@Entity('games')
@Check(`"player1_id" != "player2_id"`)
@Check(`"player1_symbol" != "player2_symbol"`)
export class Game {
  @ApiProperty({ description: 'Unique identifier for the game' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'First Player Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ type: 'uuid', name: 'player1_id' })
  player1Id: string;

  @ApiProperty({
    description: 'Second Player Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ type: 'uuid', name: 'player2_id', nullable: true })
  player2Id?: string;

  @ApiProperty({
    description: 'Winner player ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true, name: 'winner_id' })
  winnerId?: string;

  @ApiProperty({
    enum: GameStatus,
    description: 'Current status of the game',
    default: GameStatus.WAITING,
  })
  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING,
    name: 'game_status',
  })
  gameStatus: GameStatus;

  @ApiProperty({
    enum: Symbol,
    description: 'Current turn symbol',
    default: Symbol.X,
  })
  @Column({
    type: 'enum',
    enum: Symbol,
    default: Symbol.X,
    name: 'current_turn',
  })
  currentTurn: Symbol;

  @ApiProperty({
    enum: Symbol,
    description: 'Player 1 symbol',
    default: Symbol.X,
  })
  @Column({
    type: 'enum',
    enum: Symbol,
    default: Symbol.X,
    name: 'player1_symbol',
  })
  player1Symbol: Symbol;

  @ApiProperty({
    enum: Symbol,
    description: 'Player 2 symbol',
    default: Symbol.O,
  })
  @Column({
    type: 'enum',
    enum: Symbol,
    default: Symbol.O,
    name: 'player2_symbol',
  })
  player2Symbol: Symbol;

  @ApiProperty({
    enum: GameMode,
    description: 'Game mode',
    default: GameMode.PVP,
  })
  @Column({
    type: 'enum',
    enum: GameMode,
    default: GameMode.PVP,
    name: 'game_mode',
  })
  gameMode: GameMode;

  @ApiProperty({
    enum: Difficulty,
    description: 'Difficulty level for AI games',
    required: false,
  })
  @Column({
    type: 'enum',
    enum: Difficulty,
    nullable: true,
  })
  difficulty?: Difficulty;

  @ApiProperty({
    enum: ResultType,
    description: 'How the game ended',
    required: false,
  })
  @Column({
    type: 'enum',
    enum: ResultType,
    nullable: true,
    name: 'result_type',
  })
  resultType?: ResultType;

  @ApiProperty({ description: 'When the game started', required: false })
  @Column({ type: 'timestamp', nullable: true, name: 'started_at' })
  startedAt?: Date;

  @ApiProperty({ description: 'When the game completed', required: false })
  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @ApiProperty({ description: 'Game creation timestamp' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Array of move IDs for this game',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    required: false,
  })
  @Column({ type: 'simple-array', nullable: true, name: 'move_ids' })
  moveIds?: string[];

  @ApiProperty({
    description: 'Array of invitation IDs for this game',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440001'],
    required: false,
  })
  @Column({ type: 'simple-array', nullable: true, name: 'invitation_ids' })
  invitationIds?: string[];
}
