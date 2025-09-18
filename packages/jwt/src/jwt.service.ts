import { Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserPayload } from "./jwt.types";
import * as ms from "ms";

@Injectable()
export class JwtAuthService {
  secret: string;
  expirationMs: number;
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    this.expirationMs = ms("7d");
  }

  async generateToken({
    sub: id,
    email,
  }: UserPayload): Promise<{ accessToken: string; expiresAt: number }> {
    const payload: UserPayload = {
      sub: id,
      email: email,
    };

    const expiresAt = Date.now() + this.expirationMs;

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>(
        "ACCESS_TOKEN_EXPIRATION",
        "7d",
      ),
      issuer: "grid-wars",
    });

    return {
      accessToken: `Bearer ${token}`,
      expiresAt,
    };
  }

  async verifyToken(token: string): Promise<UserPayload> {
    return this.jwtService.verifyAsync<UserPayload>(token, {
      secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
    });
  }
}
