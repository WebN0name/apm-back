import { IsNumber, IsString, Min, Max } from 'class-validator';

export class JwtConfig {
  @IsString()
  ACCESS_JWT_SECRET_KEY: string;

  @IsNumber()
  @Min(60000)
  @Max(86400000)
  ACCESS_JWT_LIFE_TIME_MS: number;

  @IsString()
  ACCESS_JWT_HEADER_NAME: string;

  @IsString()
  REFRESH_JWT_SECRET_KEY: string;

  @IsNumber()
  @Min(60000)
  @Max(31536000000)
  REFRESH_JWT_LIFE_TIME_MS: number;

  @IsString()
  REFRESH_JWT_HEADER_NAME: string;
}
