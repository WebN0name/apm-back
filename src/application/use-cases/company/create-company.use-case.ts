import { ConflictException, Inject } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { IUseCase } from "src/application/core/use-case/use-case.interface";
import { CreateCompanyCommand } from "src/application/cqrs/commands/company/create-company.commands";
import CompanyEntity from "src/domain/entities/company.entity";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import { ICompanyRepository } from "src/domain/repositories/company.repository";
import { InjectCompanyRepository } from "src/domain/shared/repository/inject-company-repository";

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyUseCase implements IUseCase<CreateCompanyCommand, CompanyEntity> {
  constructor(
    @Inject(InjectCompanyRepository)
    @Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository,
    @Inject("IAdminRepository") private readonly adminRepository: IAdminRepository
  ) {}

  async execute(command: CreateCompanyCommand): Promise<CompanyEntity> {
    const { name, adminId } = command;

    const existingCompany = await this.companyRepository.findByName(name);
    if (existingCompany) {
      throw new ConflictException("Компания с таким именем уже существует");
    }

    const newCompany = new CompanyEntity({ name });
    const createdCompany = await this.companyRepository.create(newCompany);

    await this.adminRepository.attachToCompany(adminId, createdCompany.id);

    return createdCompany;
  }
}