import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AppModule } from './account.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
