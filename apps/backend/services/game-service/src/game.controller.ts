import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from '@grid-wars/common';
import { CreateGameDto } from './dto';
import { Game } from './entity';
import { UseAuth } from '@grid-wars/jwt';

@Controller('games')
export class GameController {
  constructor(private readonly appService: GameService) { }

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
    const game = await this.appService.createGame(createGameDto);
    return new ApiResponseDto<Game>({
      data: game,
      message: 'Game created successfully',
      error: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      status: HttpStatus.CREATED,
    });
  }
}
