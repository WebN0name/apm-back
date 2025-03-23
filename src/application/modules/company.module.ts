import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CompanyRepository } from "src/infrastructure/repositories/company.repository";
import { CompanyController } from "src/interfaces/http/company.controller";
import { CreateAdminCommand } from "../cqrs/commands/admin/create-admin.command";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "src/infrastructure/database/entities/company.entity";
import { CreateCompanyUseCase } from "../use-cases/company/create-company.use-case";
import { CreateCompanyCommand } from "../cqrs/commands/company/create-company.commands";
import { DeleteCompanyCommand } from "../cqrs/commands/company/delete-company.command";
import { DeleteCompanyUseCase } from "../use-cases/company/delete-company.use-case";
import { UpdateCompanyCommand } from "../cqrs/commands/company/update-company.command";
import { UpdateCompanyUseCase } from "../use-cases/company/update-company.use-case";
import { GetAdminCompaniesUseCase } from "../use-cases/company/get-include-admin-companies.use-case";
import { GetCompaniesWithoutAdminUseCase } from "../use-cases/company/get-exclude-admin-companies.use-case";
import { GetAdminCompaniesQuery } from "../cqrs/queries/company/get-admin-include-companies.command";
import { GetCompaniesWithoutAdminQuery } from "../cqrs/queries/company/get-admin-exclude-companies.command";

@Module({
  imports: [TypeOrmModule.forFeature([Company]), CqrsModule],
  controllers: [CompanyController],
  providers: [
    CompanyRepository,
    CreateCompanyCommand,
    CreateAdminCommand, 
    CreateCompanyUseCase,
    DeleteCompanyCommand,
    DeleteCompanyUseCase,
    UpdateCompanyCommand,
    UpdateCompanyUseCase,
    GetAdminCompaniesQuery,
    GetAdminCompaniesUseCase,
    GetCompaniesWithoutAdminQuery,
    GetCompaniesWithoutAdminUseCase
],
})
export class CompanyModule {}