import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CompanyRepository } from "src/infrastructure/repositories/company.repository";
import { CreateAdminCommand } from "../cqrs/commands/admin/create-admin.command";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "src/infrastructure/database/entities/company.entity";
import { Admin } from "src/infrastructure/database/entities/admin.entity";
import { AdminController } from "src/interfaces/http/admin.controller";
import { CreateAdminUseCase } from "../use-cases/admin/create-admin.use-case";
import { AdminRepository } from "src/infrastructure/repositories/admin.repository";
import { TokenService } from "src/infrastructure/auth/token.service";
import { Employee } from "src/infrastructure/database/entities/employee.entity";
import { EmployeeRepository } from "src/infrastructure/repositories/employee.repository";
import { JwtService } from "@nestjs/jwt";
import { LoginAdminCommand } from "../cqrs/commands/admin/login-admin.command";
import { LoginAdminUseCase } from "../use-cases/admin/admin-login.use-case";
import { RefreshTokenCommand } from "../cqrs/commands/admin/refresh-token-admin.command";
import { RefreshTokenUseCase } from "../use-cases/admin/admin-refresh-token.use-case";
import { GetAdminWithCompaniesUseCase } from "../use-cases/admin/get-admin.use-case";
import { AttachAdminToCompanyCommand } from "../cqrs/commands/admin/attach-admin-to-company.command";
import { DetachAdminFromCompanyCommand } from "../cqrs/commands/admin/detach-admin-to-company.command";
import { AttachAdminToCompanyUseCase } from "../use-cases/admin/attach-admin-to-company.use-case";
import { DetachAdminFromCompanyUseCase } from "../use-cases/admin/detach-admin-from-company.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([Admin, Company, Employee]), CqrsModule],
    controllers: [AdminController],
    providers: [
      CreateAdminCommand,
      CreateAdminUseCase,
      AdminRepository,
      CompanyRepository,
      EmployeeRepository,
      TokenService,
      JwtService,
      LoginAdminCommand,
      LoginAdminUseCase,
      RefreshTokenCommand,
      RefreshTokenUseCase,
      GetAdminWithCompaniesUseCase,
      AttachAdminToCompanyCommand,
      AttachAdminToCompanyUseCase,
      DetachAdminFromCompanyCommand,
      DetachAdminFromCompanyUseCase
    ],
  })
  export class AdminModule {}