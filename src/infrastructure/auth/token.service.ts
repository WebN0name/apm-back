import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FullConfig } from '../config/config';

interface TokenPair {
  accessToken: { token: string; expiresIn: number };
  refreshToken: { token: string; expiresIn: number };
}

@Injectable()
export class TokenService {
  constructor(
    private readonly _configuration: ConfigService<FullConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(email: string, id: string, username: string): Promise<TokenPair> {
    const accessExpiresIn = Number(this._configuration.get('ACCESS_JWT_LIFE_TIME_MS')) / 1000;
    const refreshExpiresIn = Number(this._configuration.get('REFRESH_JWT_LIFE_TIME_MS')) / 1000;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { email, id, username },
        {
          secret: this._configuration.get<string>('ACCESS_JWT_SECRET_KEY'),
          expiresIn: accessExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        { email, id, username },
        {
          secret: this._configuration.get<string>('REFRESH_JWT_SECRET_KEY'),
          expiresIn: refreshExpiresIn,
        },
      ),
    ]);

    return {
      accessToken: {
        token: accessToken,
        expiresIn: Math.floor(Date.now() / 1000) + accessExpiresIn,
      },
      refreshToken: {
        token: refreshToken,
        expiresIn: Math.floor(Date.now() / 1000) + refreshExpiresIn,
      },
    };
  }
}