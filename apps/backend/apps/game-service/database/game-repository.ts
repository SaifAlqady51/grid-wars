import { Injectable } from '@nestjs/common';
import { IGameRepository } from './game-repository.interface';
import { Game, GameStatus } from '../src/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GameRepository implements IGameRepository {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) { }
  async create(gameData: Partial<Game>): Promise<Game> {
    const newGame = this.gameRepository.create(gameData);
    return await this.gameRepository.save(newGame);
  }
  async findActiveGameBetweenPlayers(
    player1Id: string,
    player2Id?: string,
  ): Promise<Game | null> {
    const conditions = [
      { player1Id, player2Id, gameStatus: GameStatus.ACTIVE },
    ];

    if (player2Id) {
      conditions.push({
        player1Id: player2Id,
        player2Id: player1Id,
        gameStatus: GameStatus.ACTIVE,
      });
    }

    return await this.gameRepository.findOne({
      where: conditions,
    });
  }
  async completeGame(gameId: string): Promise<Game | null> {
    const completedGame = await this.gameRepository.update(
      { id: gameId },
      {
        gameStatus: GameStatus.COMPLETED,
        completedAt: new Date(),
      },
    );

    if (completedGame.affected === 0) {
      return null;
    }

    return await this.gameRepository.findOne({ where: { id: gameId } });
  }
}
