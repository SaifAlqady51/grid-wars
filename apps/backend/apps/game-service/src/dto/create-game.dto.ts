import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { GameMode, Difficulty, Symbol } from '../entity/game.entity';

export class CreateGameDto {
  @ApiProperty({
    description: 'First Player ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Player 1 ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Player 1 ID is required' })
  player1Id: string;

  @ApiPropertyOptional({
    description: 'Second Player ID (required for PVP games)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Player 2 ID must be a valid UUID' })
  @ValidateIf((o) => o.gameMode === GameMode.PVP)
  @IsNotEmpty({ message: 'Player 2 ID is required for PVP games' })
  player2Id?: string;

  @ApiProperty({
    enum: GameMode,
    description: 'Game mode',
    default: GameMode.PVP,
    example: GameMode.PVP,
  })
  @IsEnum(GameMode, { message: 'Game mode must be either pvp or ai' })
  gameMode: GameMode;

  @ApiPropertyOptional({
    enum: Difficulty,
    description: 'Difficulty level (required for AI games)',
    example: Difficulty.MEDIUM,
  })
  @IsOptional()
  @IsEnum(Difficulty, { message: 'Difficulty must be easy, medium, or hard' })
  @ValidateIf((o) => o.gameMode === GameMode.AI)
  @IsNotEmpty({ message: 'Difficulty is required for AI games' })
  difficulty?: Difficulty;

  @ApiPropertyOptional({
    enum: Symbol,
    description: 'Player 1 symbol preference',
    default: Symbol.X,
    example: Symbol.X,
  })
  @IsOptional()
  @IsEnum(Symbol, { message: 'Player 1 symbol must be X or O' })
  player1Symbol?: Symbol;
}
