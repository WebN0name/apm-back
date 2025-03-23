import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "src/infrastructure/database/entities/employee.entity";
import { EmployeeRepository } from "src/infrastructure/repositories/employee.repository";
import { CompanyEmployee } from "src/infrastructure/database/entities/company-employee.entity";
import { CompanyEmployeeRepository } from "src/infrastructure/repositories/company-employee.repository";
import { EmployeeController } from "src/interfaces/http/employee.controller";
import { CreateEmployeeWithCompanyCommand } from "../cqrs/commands/employee/create-employee.command";
import { CreateEmployeeWithCompanyUseCase } from "../use-cases/employee/create-employee.use-case";
import { AttachEmployeeToCompanyCommand } from "../cqrs/commands/employee/attach-emplotee.command";
import { AttachEmployeeToCompanyUseCase } from "../use-cases/employee/attach-employee.use-case";
import { DetachEmployeeFromCompanyCommand } from "../cqrs/commands/employee/detach-employee.command";
import { DetachEmployeeFromCompanyUseCase } from "../use-cases/employee/detach-employee.use-case";
import { DeleteEmployeeCommand } from "../cqrs/commands/employee/delete-employee.command";
import { DeleteEmployeeUseCase } from "../use-cases/employee/delete-employee.use-case";
import { GetEmployeesByCompanyQuery } from "../cqrs/queries/employee/get-employee-by-company.command";
import { GetEmployeesByCompanyUseCase } from "../use-cases/employee/get-employee-by-company.use-case";
import { UpdateEmployeeCommand } from "../cqrs/commands/employee/update-employee.command";
import { UpdateEmployeeUseCase } from "../use-cases/employee/update-employee.use-case";
import { GetEmployeesNotInCompanyQuery } from "../cqrs/queries/employee/get-non-in-company-employees.command";
import { GetEmployeesNotInCompanyHandler } from "../use-cases/employee/get-not-in-company.use-case";

@Module({
  imports: [TypeOrmModule.forFeature([Employee, CompanyEmployee]), CqrsModule],
  controllers: [EmployeeController],
  providers: [
    EmployeeRepository,
    CompanyEmployeeRepository,
    CreateEmployeeWithCompanyCommand,
    CreateEmployeeWithCompanyUseCase,
    AttachEmployeeToCompanyCommand,
    AttachEmployeeToCompanyUseCase,
    DetachEmployeeFromCompanyCommand,
    DetachEmployeeFromCompanyUseCase,
    DeleteEmployeeCommand,
    DeleteEmployeeUseCase,
    GetEmployeesByCompanyQuery,
    GetEmployeesByCompanyUseCase,
    UpdateEmployeeCommand,
    UpdateEmployeeUseCase,
    GetEmployeesNotInCompanyQuery,
    GetEmployeesNotInCompanyHandler
],
})
export class EmployeeModule {}