import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter, ValidationExceptionFilter } from '@/filter';
import { AccountModule } from './account.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AccountModule);
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
  await app.listen(3000);
}
bootstrap();
