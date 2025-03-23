import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { FullConfig } from '../config/config';
import { Admin } from './entities/admin.entity';
import { Company } from './entities/company.entity';
import { Employee } from './entities/employee.entity';
import { CompanyEmployee } from './entities/company-employee.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService<FullConfig>();


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DATABASE'),
  entities: [Admin, Company, Employee, CompanyEmployee],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});