import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import { GetAdminWithCompaniesQuery } from "src/application/cqrs/queries/admin/get-admin.query";
import { AdminResponseDto } from "src/interfaces/http/dto/admin/admin-response.dto";
import AdminMapper from "src/infrastructure/database/mappers/admin.mapper";
import { IUseCase } from "src/application/core/use-case/use-case.interface";

@QueryHandler(GetAdminWithCompaniesQuery)
export class GetAdminWithCompaniesUseCase implements IUseCase<GetAdminWithCompaniesQuery, AdminResponseDto> {
  constructor(@Inject("IAdminRepository") private readonly adminRepository: IAdminRepository) {}

  async execute(query: GetAdminWithCompaniesQuery): Promise<AdminResponseDto> {
    return AdminMapper.toTokenResponse(await this.adminRepository.findByIdWithCompanies(query.adminId))
  }
}