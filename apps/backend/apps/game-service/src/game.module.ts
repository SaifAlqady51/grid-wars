import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { JwtAuthModule } from '@grid-wars/jwt';
import * as process from 'process';
import { Game } from './entity/game.entity';
import { GameMove } from './entity';

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
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule { }
