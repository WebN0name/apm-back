import { CommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import { BadRequestException } from "@nestjs/common";
import { DetachAdminFromCompanyCommand } from "src/application/cqrs/commands/admin/detach-admin-to-company.command";
import { AdminResponseDto } from "src/interfaces/http/dto/admin/admin-response.dto";
import { ICompanyRepository } from "src/domain/repositories/company.repository";
import { IUseCase } from "src/application/core/use-case/use-case.interface";

@CommandHandler(DetachAdminFromCompanyCommand)
export class DetachAdminFromCompanyUseCase implements IUseCase<DetachAdminFromCompanyCommand, AdminResponseDto> {
    constructor(
        @Inject("IAdminRepository") private readonly adminRepository: IAdminRepository,
        @Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository
    ) { }

    async execute(command: DetachAdminFromCompanyCommand): Promise<AdminResponseDto> {
        const admin = await this.adminRepository.findByIdWithCompanies(command.adminId);

        if (!admin) {
            throw new NotFoundException("Админ не найден");
        }

        if (!admin.companies.some(company => company.id === command.companyId)) {
            throw new BadRequestException("Админ не привязан к этой компании");
        }

        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException("Компания не найдена");
        }

        return await this.adminRepository.detachFromCompany(command.adminId, command.companyId);
    }
}