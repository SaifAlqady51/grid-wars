import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Game } from '../entity';
import { GameStrategyFactory } from '../strategy/game-strategy-factory';
import { CreateGameDto } from '../dto';
import { GameRepository } from 'apps/game-service/database/game-repository';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CreateGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    @Inject('ACCOUNT_SERVICE') private accountClient: ClientProxy,
  ) { }
  async execute(createGameDto: CreateGameDto): Promise<Game> {
    await this.checkIfGameExists(
      createGameDto.player1Id,
      createGameDto.player2Id,
    );

    await this.validatePlayers(createGameDto);

    const strategy = GameStrategyFactory.getStrategy(createGameDto.gameMode);

    strategy.validate(createGameDto);

    const gameData = strategy.createGameData(createGameDto);

    return this.gameRepository.create(gameData);
  }

  private async checkIfGameExists(player1Id: string, player2Id?: string) {
    const exists = await this.gameRepository.findActiveGameBetweenPlayers(
      player1Id,
      player2Id,
    );

    if (exists === null) {
      return;
    }
    throw new BadRequestException(
      'An active game between these players already exists.',
    );
  }
  private async verifyUser(userId: string) {
    return lastValueFrom(
      this.accountClient.send({ cmd: 'verify_users' }, { userId }),
    );
  }

  private async validatePlayers(dto: CreateGameDto): Promise<void> {
    await this.ensurePlayerExists(dto.player1Id);

    if (dto.player2Id) {
      await this.ensurePlayerExists(dto.player2Id);
    }
  }

  private async ensurePlayerExists(playerId: string): Promise<void> {
    const exists = await this.verifyUser(playerId);

    if (!exists) {
      throw new BadRequestException('Player Id does not exist.');
    }
  }
}
