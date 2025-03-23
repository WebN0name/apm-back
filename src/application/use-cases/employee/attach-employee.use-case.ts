import { CommandHandler } from "@nestjs/cqrs";
import { ConflictException, ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { AttachEmployeeToCompanyCommand } from "src/application/cqrs/commands/employee/attach-emplotee.command";
import { IEmployeeRepository } from "src/domain/repositories/employee.repository";
import { ICompanyRepository } from "src/domain/repositories/company.repository";
import { ICompanyEmployeeRepository } from "src/domain/repositories/company-employee.repository";
import CompanyEmployeeEntity from "src/domain/entities/company-employee.entity";
import { IUseCase } from "src/application/core/use-case/use-case.interface";

@CommandHandler(AttachEmployeeToCompanyCommand)
export class AttachEmployeeToCompanyUseCase
    implements IUseCase<AttachEmployeeToCompanyCommand, CompanyEmployeeEntity> {
    constructor(
        @Inject("IEmployeeRepository") private readonly employeeRepository: IEmployeeRepository,
        @Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository,
        @Inject("ICompanyEmployeeRepository") private readonly companyEmployeeRepository: ICompanyEmployeeRepository
    ) { }

    async execute(command: AttachEmployeeToCompanyCommand): Promise<CompanyEmployeeEntity> {
        try {
            const { employeeId, companyId, position, adminId } = command;

            const employee = await this.employeeRepository.findOne({ id: employeeId });
            if (!employee) {
                throw new NotFoundException("Сотрудник не найден");
            }

            const company = await this.companyRepository.findOne({ id: companyId, adminId: adminId })

            if (!company) {
                throw new ForbiddenException("Вы не являетесь администратором этой компании или компания не найдена");
            }

            const companyCount = await this.companyEmployeeRepository.countByEmployee(employeeId);

            const existingRelation = await this.companyEmployeeRepository.findByEmployeeAndCompany(employeeId, companyId);

            if (existingRelation) {
                throw new ConflictException("Сотрудник уже состоит в этой компании");
            }

            if (companyCount >= 2) {
                throw new ConflictException("Сотрудник уже состоит в 2 компаниях");
            }


            const companyEmployee = new CompanyEmployeeEntity({
                employeeId,
                companyId,
                position
            });

            return await this.companyEmployeeRepository.save(companyEmployee);
        } catch (error) {
            if (error.code === "P0001") {
                throw new ConflictException("Сотрудник не может быть в более чем 2 компаниях");
            }
            throw error;
        }
    }
}