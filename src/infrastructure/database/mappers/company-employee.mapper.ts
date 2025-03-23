import CompanyEmployeeEntity from "src/domain/entities/company-employee.entity";
import { CompanyEmployee } from "../entities/company-employee.entity";
import CompanyMapper from "./company.mapper";
import EmployeeMapper from "./employee.mapper";

export default class CompanyEmployeeMapper {
  static toDomain(ormEntity: CompanyEmployee): CompanyEmployeeEntity {
    return new CompanyEmployeeEntity({
      employeeId: ormEntity.employeeId,
      companyId: ormEntity.companyId,
      position: ormEntity.position,
      employee: ormEntity.employee ? EmployeeMapper.toDomain(ormEntity.employee) : undefined,
      company: ormEntity.company ? CompanyMapper.toDomain(ormEntity.company) : undefined,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toPersistence(domainEntity: CompanyEmployeeEntity): CompanyEmployee {
    const companyEmployee = new CompanyEmployee();
    companyEmployee.employeeId = domainEntity.employeeId;
    companyEmployee.companyId = domainEntity.companyId;
    companyEmployee.position = domainEntity.position;
    if (domainEntity.employee) {
      companyEmployee.employee = EmployeeMapper.toPersistence(domainEntity.employee);
    }
    if (domainEntity.company) {
      companyEmployee.company = CompanyMapper.toPersistence(domainEntity.company);
    }
    companyEmployee.createdAt = domainEntity.createdAt;
    companyEmployee.updatedAt = domainEntity.updatedAt;
    return companyEmployee;
  }
}