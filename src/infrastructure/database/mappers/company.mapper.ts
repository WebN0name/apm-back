import CompanyEntity from "src/domain/entities/company.entity";
import { Company } from "../entities/company.entity";
import AdminMapper from "./admin.mapper";
import CompanyEmployeeMapper from "./company-employee.mapper";

export default class CompanyMapper {
  static toDomain(ormEntity: Company): CompanyEntity {
    return new CompanyEntity({
      id: ormEntity.id,
      name: ormEntity.name,
      admins: ormEntity.admins?.map(AdminMapper.toDomain) || [],
      employees: ormEntity.employees?.map(CompanyEmployeeMapper.toDomain) || [],
      status: ormEntity.status,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toPersistence(domainEntity: CompanyEntity): Company {
    const company = new Company();
    company.id = domainEntity.id;
    company.name = domainEntity.name;
    company.admins = domainEntity.admins?.map(AdminMapper.toPersistence) || [];
    company.employees = domainEntity.employees?.map(CompanyEmployeeMapper.toPersistence) || [];
    company.status = domainEntity.status;
    company.createdAt = domainEntity.createdAt;
    company.updatedAt = domainEntity.updatedAt;
    return company;
  }

  static toSipmleResponse(domainEntity: CompanyEntity): Company {
    const company = new Company();
    company.id = domainEntity.id;
    company.name = domainEntity.name;
    company.status = domainEntity.status;
    company.createdAt = domainEntity.createdAt;
    company.updatedAt = domainEntity.updatedAt;
    return company;
  }
}