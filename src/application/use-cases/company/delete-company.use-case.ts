import { CommandHandler } from "@nestjs/cqrs";
import { Inject, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { ICompanyRepository } from "src/domain/repositories/company.repository";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import { DeleteCompanyCommand } from "src/application/cqrs/commands/company/delete-company.command";
import CompanyEntity from "src/domain/entities/company.entity";
import { CompanyStatus } from "src/infrastructure/database/entities/company.entity";
import { IUseCase } from "src/application/core/use-case/use-case.interface";

@CommandHandler(DeleteCompanyCommand)
export class DeleteCompanyUseCase implements IUseCase<DeleteCompanyCommand, CompanyEntity> {
    constructor(
        @Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository,
        @Inject("IAdminRepository") private readonly adminRepository: IAdminRepository
    ) {}

    async execute(command: DeleteCompanyCommand): Promise<CompanyEntity> {
        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException("Компания не найдена");
        }

        const admin = await this.adminRepository.findByIdWithCompanies(command.adminId);
        if (!admin || !admin.companies.some(c => c.id === command.companyId)) {
            throw new ForbiddenException("У вас нет прав на удаление этой компании");
        }

        if (company.status === CompanyStatus.DEFAULT) {
            throw new BadRequestException("Нельзя удалить дефолтную компанию");
        }

        await this.companyRepository.delete(command.companyId);
        return company;
    }
}