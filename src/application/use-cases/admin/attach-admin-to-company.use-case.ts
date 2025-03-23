import { CommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import { AttachAdminToCompanyCommand } from "src/application/cqrs/commands/admin/attach-admin-to-company.command";
import { BadRequestException } from "@nestjs/common";
import { AdminResponseDto } from "src/interfaces/http/dto/admin/admin-response.dto";
import { ICompanyRepository } from "src/domain/repositories/company.repository";
import { Company } from "src/infrastructure/database/entities/company.entity";
import CompanyMapper from "src/infrastructure/database/mappers/company.mapper";
import { IUseCase } from "src/application/core/use-case/use-case.interface";

@CommandHandler(AttachAdminToCompanyCommand)
export class AttachAdminToCompanyUseCase implements IUseCase<AttachAdminToCompanyCommand, Company> {
    constructor(
        @Inject("IAdminRepository") private readonly adminRepository: IAdminRepository,
        @Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository
    ) {}

    async execute(command: AttachAdminToCompanyCommand): Promise<Company> {
        const admin = await this.adminRepository.findByIdWithCompanies(command.adminId);
        
        if (!admin) {
            throw new BadRequestException("Админ не найден");
        }
        

        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException("Компания не найдена");
        }

        const isAlreadyAttached = admin.companies.some(c => c.id === command.companyId);
        if (isAlreadyAttached) {
            throw new BadRequestException("Администратор уже привязан к этой компании");
        }

        await this.adminRepository.attachToCompany(command.adminId, command.companyId);

        return CompanyMapper.toSipmleResponse(company)
    }
}