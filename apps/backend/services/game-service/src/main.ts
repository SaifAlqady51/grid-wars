import { NestFactory } from '@nestjs/core';
import { GameModule } from './game.module';
import * as process from 'process';
import {
  HttpExceptionFilter,
  ValidationExceptionFilter,
} from '@grid-wars/common';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GameModule);

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new ValidationExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
