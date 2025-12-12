import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as process from 'process';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AccountModule } from './account.module';
import {
  ValidationExceptionFilter,
  HttpExceptionFilter,
} from '@grid-wars/common';

async function bootstrap() {
  const app = await NestFactory.create(AccountModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4001,
    },
  });

  await app.startAllMicroservices();

  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new HttpExceptionFilter(),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Account API')
    .setDescription('The Account API description')
    .setVersion('1.0')
    .addTag('accounts')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Save swagger.json for type generation
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.GENERATE_TYPES === 'true'
  ) {
    writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
}

bootstrap();
