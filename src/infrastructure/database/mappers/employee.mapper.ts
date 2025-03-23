import EmployeeEntity from "src/domain/entities/employee.entity";
import CompanyEmployeeMapper from "./company-employee.mapper";
import { Employee } from "../entities/employee.entity";

export default class EmployeeMapper {
  static toDomain(ormEntity: Employee): EmployeeEntity {
    return new EmployeeEntity({
      id: ormEntity.id,
      firstName: ormEntity.firstName,
      surName: ormEntity.surName,
      email: ormEntity.email,
      companies: ormEntity.companies?.map(CompanyEmployeeMapper.toDomain) || [],
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toPersistence(domainEntity: EmployeeEntity): Employee {
    const employee = new Employee();
    employee.id = domainEntity.id;
    employee.firstName = domainEntity.firstName;
    employee.surName = domainEntity.surName;
    employee.email = domainEntity.email;
    employee.companies = domainEntity.companies?.map(CompanyEmployeeMapper.toPersistence) || [];
    employee.createdAt = domainEntity.createdAt;
    employee.updatedAt = domainEntity.updatedAt;
    return employee;
  }
}