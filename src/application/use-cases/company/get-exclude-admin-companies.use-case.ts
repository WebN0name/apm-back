import { Inject } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";
import { IUseCase } from "src/application/core/use-case/use-case.interface";
import { GetCompaniesWithoutAdminQuery } from "src/application/cqrs/queries/company/get-admin-exclude-companies.command";
import CompanyEntity from "src/domain/entities/company.entity";
import { ICompanyRepository } from "src/domain/repositories/company.repository";

@QueryHandler(GetCompaniesWithoutAdminQuery)
export class GetCompaniesWithoutAdminUseCase
  implements IUseCase<GetCompaniesWithoutAdminQuery, { data: CompanyEntity[]; total: number }>
{
  constructor(@Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository) {}

  async execute(query: GetCompaniesWithoutAdminQuery): Promise<{ data: CompanyEntity[]; total: number }> {
    return this.companyRepository.findWithoutAdmin(query.adminId, query.limit, query.offset);
  }
}