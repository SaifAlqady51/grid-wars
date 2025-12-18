import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from '@grid-wars/common/dto';
import { CompleteGameRequestDto, CreateGameDto } from './dto';
import { Game } from './entity';
import { UseAuth } from '@grid-wars/jwt';
import { CreateGameUseCase } from './use-case/create-game.use-case';
import { completeGameUseCase } from './use-case/complete-game.use-case';

@Controller('games')
export class GameController {
  constructor(
    private readonly createGameUseCase: CreateGameUseCase,
    private readonly completeGameUseCase: completeGameUseCase,
  ) { }

  @Post('create-game')
  @UseAuth
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The game has been successfully created.',
    type: ApiResponseDto<Game>,
  })
  async createGame(
    @Body() createGameDto: CreateGameDto,
    @Req() request: Request,
  ): Promise<ApiResponseDto<Game>> {
    const game = await this.createGameUseCase.execute(createGameDto);
    return new ApiResponseDto<Game>({
      data: game,
      message: 'Game created successfully',
      error: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      status: HttpStatus.CREATED,
    });
  }

  @Post('complete-game')
  @UseAuth
  @ApiOperation({ summary: 'Mark a game as completed' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The game has been successfully marked as completed.',
    type: ApiResponseDto<Game>,
  })
  async completeGame(
    @Body() body: CompleteGameRequestDto,
    @Req() request: Request,
  ): Promise<ApiResponseDto<Game>> {
    const completedGame = await this.completeGameUseCase.execute(body.gameId);

    return new ApiResponseDto<Game>({
      data: completedGame,
      message: 'Game completed successfully',
      error: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      status: HttpStatus.OK,
    });
  }
}
