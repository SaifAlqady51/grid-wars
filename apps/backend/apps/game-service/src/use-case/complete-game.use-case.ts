import { Injectable } from '@nestjs/common';
import { GameRepository } from 'apps/game-service/database/game-repository';
import { Game } from '../entity';

@Injectable()
export class completeGameUseCase {
  constructor(private readonly gameRepository: GameRepository) { }

  async execute(gameId: string): Promise<Game | null> {
    const completedGame = await this.gameRepository.completeGame(gameId);
    return completedGame;
  }
}
