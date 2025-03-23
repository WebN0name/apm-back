import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { InjectTokenService } from "src/domain/shared/service/inject-token-service";
import { AccessTokenStrategy } from "src/infrastructure/auth/strategies/access-token.strategy";
import { RefreshJwtStrategy } from "src/infrastructure/auth/strategies/refresh-token.strategy";
import { TokenService } from "src/infrastructure/auth/token.service";
import { FullConfig } from "src/infrastructure/config/config";

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService<FullConfig>],
      useFactory: async (config: ConfigService<FullConfig>) => {
        const jwtConfig: JwtModuleOptions = {
          secret: config.get('ACCESS_JWT_SECRET_KEY'),
          signOptions: { expiresIn: config.get('ACCESS_JWT_LIFE_TIME_MS') },
        };

        return jwtConfig;
      },
    }),
  ],
  providers: [
    {
      provide: InjectTokenService,
      useClass: TokenService,
    },
    AccessTokenStrategy,
    RefreshJwtStrategy,
  ],
  exports: [InjectTokenService],
})
export class TokenModule {}