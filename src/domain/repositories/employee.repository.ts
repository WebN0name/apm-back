import EmployeeEntity from "src/domain/entities/employee.entity";

export interface IEmployeeRepository {
  findById(id: string): Promise<EmployeeEntity | null>;
  findByEmail(email: string): Promise<EmployeeEntity | null>;
  findOne(filter: Partial<EmployeeEntity>): Promise<EmployeeEntity | null>;
  create(employee: EmployeeEntity): Promise<EmployeeEntity>;
  findByCompanyId(companyId: string, offset: number, limit: number, search?: string): Promise<{ data: EmployeeEntity[]; total: number }>;
  findNotInCompany(companyId: string, offset: number, limit: number): Promise<{ data: EmployeeEntity[]; total: number }>; // 🔹 Новый метод
  save(employee: EmployeeEntity): Promise<EmployeeEntity>;
  delete(id: string): Promise<void>;
}