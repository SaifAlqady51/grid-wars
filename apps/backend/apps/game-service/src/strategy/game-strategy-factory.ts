import { GameMode } from '../entity';
import { GameStrategy } from './game-strategy';
import { AiGameStrategy } from './ai-game-strategy';
import { PVPGameStrategy } from './pvp-game-strategy';

export class GameStrategyFactory {
  static getStrategy(gameMode: GameMode): GameStrategy {
    switch (gameMode) {
      case GameMode.AI:
        return new AiGameStrategy();
      case GameMode.PVP:
        return new PVPGameStrategy();
      default:
        throw new Error(`Unsupported game mode: ${gameMode}`);
    }
  }
}
