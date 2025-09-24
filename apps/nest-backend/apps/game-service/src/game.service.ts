import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Game } from './entity/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGameDto } from './dto';
import { GameStrategyFactory } from './strategy/game-strategy-factory';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) { }
  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    const strategy = GameStrategyFactory.getStrategy(createGameDto.gameMode);

    strategy.validate(createGameDto);

    const gameData = strategy.createGameData(createGameDto);

    const newGame = this.gameRepository.create(gameData);
    return await this.gameRepository.save(newGame);
  }
}
