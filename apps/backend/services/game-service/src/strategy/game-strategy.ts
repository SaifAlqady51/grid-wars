import { CreateGameDto } from '@/dto';
import { Game } from '@/entity';

export interface GameStrategy {
  validate(createGameDto: CreateGameDto): void;
  createGameData(createGameDto: CreateGameDto): Partial<Game>;
}
