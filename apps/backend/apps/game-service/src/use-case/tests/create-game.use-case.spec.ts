import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  expect,
  describe,
  jest,
  beforeEach,
  afterEach,
  it,
} from '@jest/globals';
import { CreateGameUseCase } from '../create-game.use-case';
import { Difficulty, Game, GameMode, GameStatus, Symbol } from '../../entity';
import { GameStrategyFactory } from '../../strategy/game-strategy-factory';
import { CreateGameDto } from '../../dto';
import { Repository } from 'typeorm';
import { GameStrategy } from '../../strategy/game-strategy';

describe('CreateGameUseCase', () => {
  let useCase: CreateGameUseCase;
  let gameRepository: jest.Mocked<Repository<Game>>;

  const mockGameRepository: jest.Mocked<Repository<Game>> = {
    create: jest.fn(),
    save: jest.fn(),
  } as any;

  const mockStrategy: jest.Mocked<GameStrategy> = {
    validate: jest.fn(),
    createGameData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateGameUseCase,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateGameUseCase>(CreateGameUseCase);
    gameRepository = module.get(getRepositoryToken(Game));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    describe('PVP mode', () => {
      it('should create and save a PVP game successfully', async () => {
        // Arrange
        const createGameDto: CreateGameDto = {
          player1Id: '123e4567-e89b-12d3-a456-426614174000',
          player2Id: '123e4567-e89b-12d3-a456-426614174001',
          gameMode: GameMode.PVP,
          player1Symbol: Symbol.X,
        };

        const gameData = {
          player1Id: createGameDto.player1Id,
          player2Id: createGameDto.player2Id,
          gameMode: GameMode.PVP,
          player1Symbol: Symbol.X,
          player2Symbol: Symbol.O,
          gameStatus: GameStatus.WAITING,
          currentTurn: Symbol.X,
        };

        const savedGame: Game = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          ...gameData,
          createdAt: new Date(),
        } as Game;

        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockReturnValue(undefined);
        mockStrategy.createGameData.mockReturnValue(gameData);
        mockGameRepository.create.mockReturnValue(savedGame);
        mockGameRepository.save.mockResolvedValue(savedGame);

        // Act
        const result = await useCase.execute(createGameDto);

        // Assert
        expect(GameStrategyFactory.getStrategy).toHaveBeenCalledWith(
          GameMode.PVP,
        );
        expect(mockStrategy.validate).toHaveBeenCalledWith(createGameDto);
        expect(mockStrategy.createGameData).toHaveBeenCalledWith(createGameDto);
        expect(mockGameRepository.create).toHaveBeenCalledWith(gameData);
        expect(mockGameRepository.save).toHaveBeenCalledWith(savedGame);
        expect(result).toEqual(savedGame);
        expect(result.gameMode).toBe(GameMode.PVP);
        expect(result.player1Id).toBe(createGameDto.player1Id);
        expect(result.player2Id).toBe(createGameDto.player2Id);
      });

      it('should create PVP game with default player1Symbol as X', async () => {
        // Arrange
        const createGameDto: CreateGameDto = {
          player1Id: '123e4567-e89b-12d3-a456-426614174000',
          player2Id: '123e4567-e89b-12d3-a456-426614174001',
          gameMode: GameMode.PVP,
        };

        const gameData = {
          player1Id: createGameDto.player1Id,
          player2Id: createGameDto.player2Id,
          gameMode: GameMode.PVP,
          player1Symbol: Symbol.X,
          player2Symbol: Symbol.O,
          gameStatus: GameStatus.WAITING,
          currentTurn: Symbol.X,
        };

        const savedGame: Game = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          ...gameData,
          createdAt: new Date(),
        } as Game;

        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockReturnValue(undefined);
        mockStrategy.createGameData.mockReturnValue(gameData);
        mockGameRepository.create.mockReturnValue(savedGame);
        mockGameRepository.save.mockResolvedValue(savedGame);

        // Act
        const result = await useCase.execute(createGameDto);

        // Assert
        expect(result.player1Symbol).toBe(Symbol.X);
        expect(result.player2Symbol).toBe(Symbol.O);
      });

      it('should handle player1Symbol as O and set player2Symbol as X', async () => {
        // Arrange
        const createGameDto: CreateGameDto = {
          player1Id: '123e4567-e89b-12d3-a456-426614174000',
          player2Id: '123e4567-e89b-12d3-a456-426614174001',
          gameMode: GameMode.PVP,
          player1Symbol: Symbol.O,
        };

        const gameData = {
          player1Id: createGameDto.player1Id,
          player2Id: createGameDto.player2Id,
          gameMode: GameMode.PVP,
          player1Symbol: Symbol.O,
          player2Symbol: Symbol.X,
          gameStatus: GameStatus.WAITING,
          currentTurn: Symbol.X,
        };

        const savedGame = { id: 'test-id', ...gameData } as Game;

        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockReturnValue(undefined);
        mockStrategy.createGameData.mockReturnValue(gameData);
        mockGameRepository.create.mockReturnValue(savedGame);
        mockGameRepository.save.mockResolvedValue(savedGame);

        // Act
        const result = await useCase.execute(createGameDto);

        // Assert
        expect(result.player1Symbol).toBe(Symbol.O);
        expect(result.player2Symbol).toBe(Symbol.X);
      });
    });

    describe('AI mode', () => {
      it('should create and save an AI game with easy difficulty', async () => {
        // Arrange
        const createGameDto: CreateGameDto = {
          player1Id: '123e4567-e89b-12d3-a456-426614174000',
          gameMode: GameMode.AI,
          difficulty: Difficulty.EASY,
          player1Symbol: Symbol.X,
        };

        const gameData = {
          player1Id: createGameDto.player1Id,
          gameMode: GameMode.AI,
          difficulty: Difficulty.EASY,
          player1Symbol: Symbol.X,
          player2Symbol: Symbol.O,
          gameStatus: GameStatus.ACTIVE,
          currentTurn: Symbol.X,
        };

        const savedGame: Game = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          ...gameData,
          createdAt: new Date(),
        } as Game;

        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockReturnValue(undefined);
        mockStrategy.createGameData.mockReturnValue(gameData);
        mockGameRepository.create.mockReturnValue(savedGame);
        mockGameRepository.save.mockResolvedValue(savedGame);

        // Act
        const result = await useCase.execute(createGameDto);

        // Assert
        expect(GameStrategyFactory.getStrategy).toHaveBeenCalledWith(
          GameMode.AI,
        );
        expect(mockStrategy.validate).toHaveBeenCalledWith(createGameDto);
        expect(mockStrategy.createGameData).toHaveBeenCalledWith(createGameDto);
        expect(result.gameMode).toBe(GameMode.AI);
        expect(result.difficulty).toBe(Difficulty.EASY);
        expect(result.player2Id).toBeUndefined();
      });

      it('should create AI game with medium difficulty', async () => {
        // Arrange
        const createGameDto: CreateGameDto = {
          player1Id: '123e4567-e89b-12d3-a456-426614174000',
          gameMode: GameMode.AI,
          difficulty: Difficulty.MEDIUM,
        };

        const gameData = {
          player1Id: createGameDto.player1Id,
          gameMode: GameMode.AI,
          difficulty: Difficulty.MEDIUM,
          player1Symbol: Symbol.X,
          player2Symbol: Symbol.O,
          gameStatus: GameStatus.ACTIVE,
          currentTurn: Symbol.X,
        };

        const savedGame = { id: 'test-id', ...gameData } as Game;

        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockReturnValue(undefined);
        mockStrategy.createGameData.mockReturnValue(gameData);
        mockGameRepository.create.mockReturnValue(savedGame);
        mockGameRepository.save.mockResolvedValue(savedGame);

        // Act
        const result = await useCase.execute(createGameDto);

        // Assert
        expect(result.difficulty).toBe(Difficulty.MEDIUM);
      });

      it('should create AI game with hard difficulty', async () => {
        // Arrange
        const createGameDto: CreateGameDto = {
          player1Id: '123e4567-e89b-12d3-a456-426614174000',
          gameMode: GameMode.AI,
          difficulty: Difficulty.HARD,
        };

        const gameData = {
          player1Id: createGameDto.player1Id,
          gameMode: GameMode.AI,
          difficulty: Difficulty.HARD,
          player1Symbol: Symbol.X,
          player2Symbol: Symbol.O,
          gameStatus: GameStatus.ACTIVE,
          currentTurn: Symbol.X,
        };

        const savedGame = { id: 'test-id', ...gameData } as Game;

        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockReturnValue(undefined);
        mockStrategy.createGameData.mockReturnValue(gameData);
        mockGameRepository.create.mockReturnValue(savedGame);
        mockGameRepository.save.mockResolvedValue(savedGame);

        // Act
        const result = await useCase.execute(createGameDto);

        // Assert
        expect(result.difficulty).toBe(Difficulty.HARD);
      });
    });

    describe('Error handling', () => {
      it('should throw error when strategy validation fails', async () => {
        // Arrange
        const createGameDto: CreateGameDto = {
          player1Id: '123e4567-e89b-12d3-a456-426614174000',
          gameMode: GameMode.PVP,
        };

        const validationError = new Error(
          'Player 2 ID is required for PVP games',
        );
        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockImplementation(() => {
          throw validationError;
        });

        // Act & Assert
        await expect(useCase.execute(createGameDto)).rejects.toThrow(
          validationError,
        );
        expect(GameStrategyFactory.getStrategy).toHaveBeenCalledWith(
          GameMode.PVP,
        );
        expect(mockStrategy.validate).toHaveBeenCalledWith(createGameDto);
        expect(mockGameRepository.create).not.toHaveBeenCalled();
        expect(mockGameRepository.save).not.toHaveBeenCalled();
      });

      it('should throw error when repository save fails', async () => {
        // Arrange
        const createGameDto: CreateGameDto = {
          player1Id: '123e4567-e89b-12d3-a456-426614174000',
          player2Id: '123e4567-e89b-12d3-a456-426614174001',
          gameMode: GameMode.PVP,
        };

        const gameData = {
          player1Id: createGameDto.player1Id,
          player2Id: createGameDto.player2Id,
          gameMode: GameMode.PVP,
          player1Symbol: Symbol.X,
          player2Symbol: Symbol.O,
          gameStatus: GameStatus.WAITING,
          currentTurn: Symbol.X,
        };

        const dbError = new Error('Database connection failed');

        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockReturnValue(undefined);
        mockStrategy.createGameData.mockReturnValue(gameData);
        mockGameRepository.create.mockReturnValue(gameData as Game);
        mockGameRepository.save.mockRejectedValue(dbError);

        // Act & Assert
        await expect(useCase.execute(createGameDto)).rejects.toThrow(dbError);
        expect(mockGameRepository.save).toHaveBeenCalled();
      });

      it('should throw error when AI game is missing difficulty', async () => {
        // Arrange
        const createGameDto: CreateGameDto = {
          player1Id: '123e4567-e89b-12d3-a456-426614174000',
          gameMode: GameMode.AI,
        };

        const validationError = new Error(
          'Difficulty is required for AI games',
        );
        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockImplementation(() => {
          throw validationError;
        });

        // Act & Assert
        await expect(useCase.execute(createGameDto)).rejects.toThrow(
          validationError,
        );
      });

      it('should throw error when same player ID used for player1 and player2', async () => {
        // Arrange
        const samePlayerId = '123e4567-e89b-12d3-a456-426614174000';
        const createGameDto: CreateGameDto = {
          player1Id: samePlayerId,
          player2Id: samePlayerId,
          gameMode: GameMode.PVP,
        };

        const validationError = new Error(
          'Player 1 and Player 2 must be different',
        );
        jest
          .spyOn(GameStrategyFactory, 'getStrategy')
          .mockReturnValue(mockStrategy);
        mockStrategy.validate.mockImplementation(() => {
          throw validationError;
        });

        // Act & Assert
        await expect(useCase.execute(createGameDto)).rejects.toThrow(
          validationError,
        );
      });
    });
  });
});
