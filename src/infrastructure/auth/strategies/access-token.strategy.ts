import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FullConfig } from '../../config/config';

export const AccessJwtStrategyAlias = 'access-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, AccessJwtStrategyAlias) {
  constructor(private readonly _configuration: ConfigService<FullConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configuration.get('ACCESS_JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
