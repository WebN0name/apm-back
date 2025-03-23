import CompanyEmployeeEntity from "src/domain/entities/company-employee.entity";

export interface ICompanyEmployeeRepository {
  findByEmployeeAndCompany(employeeId: string, companyId: string): Promise<CompanyEmployeeEntity | null>;
  countByEmployee(employeeId: string): Promise<number>;
  findOne(filter: Partial<CompanyEmployeeEntity>): Promise<CompanyEmployeeEntity | null>;
  create(employeeId: string, companyId: string, position: string): Promise<CompanyEmployeeEntity>;
  save(companyEmployee: CompanyEmployeeEntity): Promise<CompanyEmployeeEntity>;
  delete(employeeId: string, companyId: string): Promise<void>;
}