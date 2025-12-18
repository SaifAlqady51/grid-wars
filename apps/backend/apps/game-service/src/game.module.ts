import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { GameController } from './game.controller';
import { JwtAuthModule } from '@grid-wars/jwt';
import * as process from 'process';
import { Game } from './entity/game.entity';
import { GameMove } from './entity';
import { CreateGameUseCase } from './use-case/create-game.use-case';
import { GameRepository } from '../database/game-repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { completeGameUseCase } from './use-case/complete-game.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(process.cwd(), 'apps/game-service/.env')],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
        logging: configService.get('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Game, GameMove]),
    JwtAuthModule.forRootAsync({ isGlobal: false }),
    ClientsModule.register([
      {
        name: 'ACCOUNT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: 4001,
        },
      },
    ]),
  ],
  controllers: [GameController],
  providers: [CreateGameUseCase, completeGameUseCase, GameRepository],
})
export class GameModule { }
