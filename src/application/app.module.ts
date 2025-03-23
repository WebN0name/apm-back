import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from 'src/infrastructure/config/config';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CompanyModule } from './modules/company.module';
import { TokenModule } from './modules/token.module';
import { AdminModule } from './modules/admin.module';
import { EmployeeModule } from './modules/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
    TokenModule,
    DatabaseModule,
    AdminModule,
    CompanyModule,
    EmployeeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
