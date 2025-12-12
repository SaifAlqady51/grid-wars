import { Game } from '../src/entity';

export interface IGameRepository {
  create(gameData: Partial<Game>): Promise<Game>;
  findActiveGameBetweenPlayers(
    player1Id: string,
    player2Id?: string,
  ): Promise<Game | null>;
}
