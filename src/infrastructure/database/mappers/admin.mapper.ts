import AdminEntity from "src/domain/entities/admin.entity";
import { Admin } from "../entities/admin.entity";
import CompanyMapper from "./company.mapper";
import { AdminResponseDto } from "src/interfaces/http/dto/admin/admin-response.dto";

export default class AdminMapper {
  static toDomain(ormEntity: Admin): AdminEntity {
    return new AdminEntity({
      id: ormEntity.id,
      username: ormEntity.username,
      email: ormEntity.email,
      password: ormEntity.password,
      companies: ormEntity.companies?.map(CompanyMapper.toDomain) || [],
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toPersistence(domainEntity: AdminEntity): Admin {
    const admin = new Admin();
    admin.id = domainEntity.id;
    admin.username = domainEntity.username;
    admin.email = domainEntity.email;
    admin.companies = domainEntity.companies?.map(CompanyMapper.toSipmleResponse) || [];
    admin.createdAt = domainEntity.createdAt;
    admin.updatedAt = domainEntity.updatedAt;
    return admin;
  }

  static toTokenResponse(domainEntity: AdminEntity): AdminResponseDto{
    const admin = new Admin();
    admin.id = domainEntity.id;
    admin.username = domainEntity.username;
    admin.email = domainEntity.email;
    admin.createdAt = domainEntity.createdAt;
    admin.updatedAt = domainEntity.updatedAt;
    return admin;
  }
}