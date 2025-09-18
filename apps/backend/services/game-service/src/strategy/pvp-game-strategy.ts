import { CreateGameDto } from '@/dto';
import { Game, GameMode, GameStatus, Symbol } from '@/entity';
import { GameStrategy } from './game-strategy';

export class PVPGameStrategy implements GameStrategy {
  validate(createGameDto: CreateGameDto): void {
    if (!createGameDto.player2Id) {
      throw new Error('Player 2 ID is required for PVP games');
    }
  }

  createGameData(createGameDto: CreateGameDto): Partial<Game> {
    const { player1Id, player2Id, player1Symbol = Symbol.X } = createGameDto;

    return {
      player1Id,
      player2Id,
      gameMode: GameMode.PVP,
      difficulty: undefined,
      player1Symbol,
      player2Symbol: player1Symbol === Symbol.X ? Symbol.O : Symbol.X,
      gameStatus: GameStatus.ACTIVE,
      currentTurn: Symbol.X,
      startedAt: new Date(),
    };
  }
}
