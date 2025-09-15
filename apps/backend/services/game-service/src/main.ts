import { NestFactory } from '@nestjs/core';
import { GameModule } from './game.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(GameModule);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
