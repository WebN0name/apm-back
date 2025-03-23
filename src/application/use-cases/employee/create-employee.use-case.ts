import { CommandHandler } from "@nestjs/cqrs";
import { ForbiddenException, Inject } from "@nestjs/common";
import { IEmployeeRepository } from "src/domain/repositories/employee.repository";
import { ICompanyRepository } from "src/domain/repositories/company.repository";
import { BadRequestException } from "@nestjs/common";
import { CreateEmployeeWithCompanyCommand } from "src/application/cqrs/commands/employee/create-employee.command";
import EmployeeEntity from "src/domain/entities/employee.entity";
import CompanyEmployeeEntity from "src/domain/entities/company-employee.entity";
import { ICompanyEmployeeRepository } from "src/domain/repositories/company-employee.repository";
import { IUseCase } from "src/application/core/use-case/use-case.interface";

@CommandHandler(CreateEmployeeWithCompanyCommand)
export class CreateEmployeeWithCompanyUseCase implements IUseCase<CreateEmployeeWithCompanyCommand, EmployeeEntity> {
    constructor(
        @Inject("IEmployeeRepository") private readonly employeeRepository: IEmployeeRepository,
        @Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository,
        @Inject("ICompanyEmployeeRepository") private readonly companyEmployeeRepository: ICompanyEmployeeRepository
    ) {}

    async execute(command: CreateEmployeeWithCompanyCommand): Promise<EmployeeEntity> {
        const existingEmployee = await this.employeeRepository.findByEmail(command.email);
        if (existingEmployee) {
            throw new BadRequestException("Сотрудник с таким email уже существует");
        }

        const company = await this.companyRepository.findOne({ id: command.companyId, adminId: command.adminId })
        
        if (!company) {
            throw new ForbiddenException("Вы не являетесь администратором этой компании или компания не найдена");
        }

        const employee = new EmployeeEntity({
            firstName: command.firstName,
            surName: command.surName,
            email: command.email,
        });
    
        const savedEmployee = await this.employeeRepository.save(employee);
    
        const companyEmployee = new CompanyEmployeeEntity({
            employeeId: savedEmployee.id,
            companyId: command.companyId,
            position: command.position,
        });

        await this.companyEmployeeRepository.save(companyEmployee);

        return  savedEmployee;
    }
}