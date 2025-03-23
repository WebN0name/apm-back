import { Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FullConfig } from '../config/config';
import { Admin } from './entities/admin.entity';
import { Company } from './entities/company.entity';
import { Employee } from './entities/employee.entity';
import { CompanyEmployee } from './entities/company-employee.entity';
import { InjectCompanyRepository } from 'src/domain/shared/repository/inject-company-repository';
import { CompanyRepository } from '../repositories/company.repository';
import CompanyMapper from './mappers/company.mapper';
import { InjectAdminRepository } from 'src/domain/shared/repository/inject-admin-repository';
import { AdminRepository } from '../repositories/admin.repository';
import { InjectEmployeeRepository } from 'src/domain/shared/repository/inject-employee-repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import AdminMapper from './mappers/admin.mapper';
import EmployeeMapper from './mappers/employee.mapper';
import { InjectCompanyEmployeeRepository } from 'src/domain/shared/repository/inject-company-employee-repository';
import { CompanyEmployeeRepository } from '../repositories/company-employee.repository';

const repositories: Provider[] = [
    {
        provide: InjectCompanyRepository,
        useClass: CompanyRepository,
      },
      {
        provide: InjectAdminRepository,
        useClass: AdminRepository,
      },
      {
        provide: InjectEmployeeRepository,
        useClass: EmployeeRepository,
      },
      {
        provide: InjectCompanyEmployeeRepository,
        useClass: CompanyEmployeeRepository,
      },
];

const mappers: Provider[] = [CompanyMapper, AdminMapper, EmployeeMapper];

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService<FullConfig>) => {
                return {
                    type: config.get('DB_TYPE'),
                    host: config.get('POSTGRES_HOST'),
                    port: config.get('POSTGRES_PORT'),
                    username: config.get('POSTGRES_USER'),
                    password: config.get('POSTGRES_PASSWORD'),
                    database: config.get('POSTGRES_DATABASE'),
                    synchronize: config.get('NODE_ENV') !== 'production',
                    entities: [Admin, Company, Employee, CompanyEmployee, CompanyEmployee],
                    migrations: ['src/infrastructure/database/migrations/*.ts'],
                } as TypeOrmModuleOptions;
            },
            inject: [ConfigService<FullConfig>],
        }),
        TypeOrmModule.forFeature([Admin, Company, Employee, CompanyEmployee]),
    ],
    providers: [...repositories, ...mappers],
    exports: repositories,
})
export class DatabaseModule { }
