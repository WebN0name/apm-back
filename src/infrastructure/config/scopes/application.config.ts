import { IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';

export enum EnvironmentTypes {
    development = 'development',
    production = 'production',
  }

export class ApplicationConfig {
  @IsString()
  SERVICE_NAME: string;

  @IsEnum(EnvironmentTypes)
  NODE_ENV: EnvironmentTypes;

  @IsNumber()
  @Min(1025)
  @Max(65536)
  PORT: number;
}
