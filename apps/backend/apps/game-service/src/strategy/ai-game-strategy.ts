import { CreateGameDto } from '../dto';
import { Game, GameMode, GameStatus, Symbol } from '../entity';
import { GameStrategy } from './game-strategy';

export class AiGameStrategy implements GameStrategy {
  validate(createGameDto: CreateGameDto): void {
    if (!createGameDto.difficulty) {
      throw new Error('Difficulty is required for AI games');
    }
  }

  createGameData(createGameDto: CreateGameDto): Partial<Game> {
    const { player1Id, player1Symbol = Symbol.X } = createGameDto;
    return {
      player1Id,
      player2Id: undefined,
      gameMode: GameMode.AI,
      difficulty: createGameDto.difficulty,
      player1Symbol,
      gameStatus: GameStatus.ACTIVE,
      currentTurn: Symbol.X,
      startedAt: new Date(),
    };
  }
}
