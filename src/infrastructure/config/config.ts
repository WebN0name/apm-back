import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ApplicationConfig } from './scopes/application.config';
import { PostgresConfig } from './scopes/pg.config';
import { JwtConfig } from './scopes/jwt.config';

export type FullConfig = ApplicationConfig & PostgresConfig & JwtConfig;

function validateConfigScope(config: Record<string, unknown>, scope: ClassConstructor<any>) {
  const validatedConfig = plainToInstance(scope, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
}

export function validateConfig(config: Record<string, unknown>) {
  validateConfigScope(config, ApplicationConfig);
  validateConfigScope(config, JwtConfig);
  validateConfigScope(config, PostgresConfig);

  return config;
}
