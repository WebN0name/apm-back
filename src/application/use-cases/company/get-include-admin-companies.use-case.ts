import { Inject } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";
import { IQueryHandler } from "src/application/core/use-case/use-case.interface";
import { GetAdminCompaniesQuery } from "src/application/cqrs/queries/company/get-admin-include-companies.command";
import CompanyEntity from "src/domain/entities/company.entity";
import { ICompanyRepository } from "src/domain/repositories/company.repository";

@QueryHandler(GetAdminCompaniesQuery)
export class GetAdminCompaniesUseCase implements IQueryHandler<GetAdminCompaniesQuery, { data: CompanyEntity[], total: number }> {
    constructor(@Inject("ICompanyRepository") private readonly companyRepository: ICompanyRepository) {}

    async execute(query: GetAdminCompaniesQuery): Promise<{ data: CompanyEntity[], total: number }> {
        return this.companyRepository.findByAdminId(query.adminId, Number(query.limit), Number(query.offset));
    }
}