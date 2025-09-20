import { DynamicModule, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtAuthService } from "./jwt.service";
import { JWTAccessTokenStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";

export interface JwtAuthModuleOptions {
  isGlobal?: boolean;
}

@Module({})
export class JwtAuthModule {
  static forRootAsync(options?: JwtAuthModuleOptions): DynamicModule {
    return {
      module: JwtAuthModule,
      global: options?.isGlobal || false,
      imports: [
        ConfigModule, // Add this import to make ConfigService available
        JwtModule.registerAsync({
          imports: [ConfigModule], // Add this import for the async factory
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>("JWT_SECRET"),
            signOptions: {
              expiresIn: configService.get<string>("JWT_EXPIRES_IN", "1h"),
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [JwtAuthService, JWTAccessTokenStrategy, JwtAuthGuard],
      exports: [
        JwtAuthService,
        JWTAccessTokenStrategy,
        JwtAuthGuard,
        JwtModule,
      ],
    };
  }
}
