import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';
@Controller()
export class GameController {
  constructor(private readonly appService: GameService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
