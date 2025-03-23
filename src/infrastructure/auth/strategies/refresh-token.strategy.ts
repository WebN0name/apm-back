import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FullConfig } from '../../config/config';

export const RefreshJwtStrategyAlias = 'refresh-jwt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, RefreshJwtStrategyAlias) {
  constructor(private readonly _configuration: ConfigService<FullConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(_configuration.get('REFRESH_JWT_HEADER_NAME')),
      ignoreExpiration: false,
      secretOrKey: _configuration.get('REFRESH_JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
