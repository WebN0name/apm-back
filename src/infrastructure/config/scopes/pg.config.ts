import { IsNumber, IsString } from 'class-validator';

export class PostgresConfig {
  @IsString()
  DB_TYPE: string;

  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DATABASE: string;
}