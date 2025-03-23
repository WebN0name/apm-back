import { Inject, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { IUseCase } from "src/application/core/use-case/use-case.interface";
import { DetachEmployeeFromCompanyCommand } from "src/application/cqrs/commands/employee/detach-employee.command";
import CompanyEmployeeEntity from "src/domain/entities/company-employee.entity";
import { ICompanyEmployeeRepository } from "src/domain/repositories/company-employee.repository";
import { ICompanyRepository } from "src/domain/repositories/company.repository";

@CommandHandler(DetachEmployeeFromCompanyCommand)
export class DetachEmployeeFromCompanyUseCase implements IUseCase<DetachEmployeeFromCompanyCommand, CompanyEmployeeEntity> {
    constructor(
        @Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository,
        @Inject("ICompanyEmployeeRepository") private readonly companyEmployeeRepository: ICompanyEmployeeRepository
    ) { }

    async execute(command: DetachEmployeeFromCompanyCommand): Promise<CompanyEmployeeEntity> {
        const { employeeId, companyId, adminId } = command;

        const defaultCompany = await this.companyRepository.findByName('Без текущего места работы');
        if (!defaultCompany) {
            throw new NotFoundException('Дефолтная компания не найдена');
        }

        const company = await this.companyRepository.findOne({ id: companyId, adminId })

        if (!company) {
            throw new ForbiddenException("Вы не являетесь администратором этой компании или компания не найдена");
        }

        if (companyId === defaultCompany.id) {
            throw new BadRequestException('Нельзя удалить сотрудника из дефолтной компании');
        }

        const employeeInCompany = await this.companyEmployeeRepository.findOne({ employeeId, companyId });
        if (!employeeInCompany) {
            throw new NotFoundException('Сотрудник не найден в этой компании');
        }

        await this.companyEmployeeRepository.delete(employeeId, companyId);

        return employeeInCompany;
    }
}