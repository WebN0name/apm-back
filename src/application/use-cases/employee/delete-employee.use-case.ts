import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { IUseCase } from "src/application/core/use-case/use-case.interface";
import { DeleteEmployeeCommand } from "src/application/cqrs/commands/employee/delete-employee.command";
import EmployeeEntity from "src/domain/entities/employee.entity";
import { ICompanyEmployeeRepository } from "src/domain/repositories/company-employee.repository";
import { ICompanyRepository } from "src/domain/repositories/company.repository";
import { IEmployeeRepository } from "src/domain/repositories/employee.repository";
import { CompanyStatus } from "src/infrastructure/database/entities/company.entity";

@CommandHandler(DeleteEmployeeCommand)
export class DeleteEmployeeUseCase implements IUseCase<DeleteEmployeeCommand, EmployeeEntity> {
    constructor(
        @Inject("IEmployeeRepository") private readonly employeeRepository: IEmployeeRepository,
        @Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository,
        @Inject("ICompanyEmployeeRepository") private readonly companyEmployeeRepository: ICompanyEmployeeRepository
    ) { }

    async execute(command: DeleteEmployeeCommand): Promise<EmployeeEntity> {
        const { employeeId } = command;

        // Проверяем существование сотрудника
        const employee = await this.employeeRepository.findOne({ id: employeeId } );
        if (!employee) {
            throw new NotFoundException("Сотрудник не найден.");
        }

        const defaultCompany = await this.companyRepository.findByStatus(CompanyStatus.DEFAULT );

        if (!defaultCompany) {
            throw new BadRequestException("Дефолтная компания не найдена.");
        }

        const defaultCompanyEmployee = await this.companyEmployeeRepository.findByEmployeeAndCompany(
            employeeId,
            defaultCompany.id
        );

        if (!defaultCompanyEmployee) {
            throw new BadRequestException("Сотрудник не находится в дефолтной компании.");
        }

        await this.companyEmployeeRepository.delete(employeeId, defaultCompany.id);

        await this.employeeRepository.delete( employeeId );

        return employee;
    }
}