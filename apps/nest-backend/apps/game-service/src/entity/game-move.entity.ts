import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Check,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Symbol } from './game.entity';

@Entity('game_moves')
@Unique(['gameId', 'position'])
@Unique(['gameId', 'moveNumber'])
@Check(`"position" >= 0 AND "position" <= 8`)
@Check(`"move_number" > 0 AND "move_number" <= 9`)
export class GameMove {
  @ApiProperty({ description: 'Unique identifier for the move' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Game ID this move belongs to' })
  @Column({ name: 'game_id' })
  gameId: number;

  @ApiProperty({ description: 'Player ID who made the move' })
  @Column({ name: 'player_id' })
  playerId: number;

  @ApiProperty({
    description: 'Board position (0-8)',
    minimum: 0,
    maximum: 8,
    example: 4,
  })
  @Column({ type: 'int' })
  position: number;

  @ApiProperty({ enum: Symbol, description: 'Symbol placed (X or O)' })
  @Column({ type: 'enum', enum: Symbol })
  symbol: Symbol;

  @ApiProperty({
    description: 'Move sequence number',
    minimum: 1,
    maximum: 9,
    example: 1,
  })
  @Column({ type: 'int', name: 'move_number' })
  moveNumber: number;

  @ApiProperty({ description: 'When the move was made' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Row position (0-2)' })
  get row(): number {
    return Math.floor(this.position / 3);
  }

  @ApiProperty({ description: 'Column position (0-2)' })
  get col(): number {
    return this.position % 3;
  }
}
