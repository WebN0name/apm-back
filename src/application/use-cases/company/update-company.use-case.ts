import { CommandHandler } from "@nestjs/cqrs";
import { Inject, ForbiddenException, NotFoundException } from "@nestjs/common";
import { ICompanyRepository } from "src/domain/repositories/company.repository";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import { UpdateCompanyCommand } from "src/application/cqrs/commands/company/update-company.command";
import CompanyEntity from "src/domain/entities/company.entity";
import CompanyMapper from "src/infrastructure/database/mappers/company.mapper";
import { IUseCase } from "src/application/core/use-case/use-case.interface";

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyUseCase implements IUseCase<UpdateCompanyCommand, CompanyEntity> {
    constructor(
        @Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository,
        @Inject("IAdminRepository") private readonly adminRepository: IAdminRepository
    ) {}

    async execute(command: UpdateCompanyCommand): Promise<CompanyEntity> {
        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException("Компания не найдена");
        }

        const admin = await this.adminRepository.findByIdWithCompanies(command.adminId);
        if (!admin || !admin.companies.some(c => c.id === command.companyId)) {
            throw new ForbiddenException("У вас нет прав на обновление этой компании");
        }

        company.name = command.name;
        const newCompany = await this.companyRepository.save(company);

        return CompanyMapper.toSipmleResponse(newCompany)
    }
}