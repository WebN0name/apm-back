import { CompanyStatus } from "src/infrastructure/database/entities/company.entity";
import CompanyEntity from "../entities/company.entity";

export interface ICompanyRepository {
  findById(id: string): Promise<CompanyEntity | null>;
  findByIds(ids: string[]): Promise<CompanyEntity[]>;
  findByName(name: string): Promise<CompanyEntity | null>;
  findOne(criteria: Partial<Pick<CompanyEntity, "id">> & { adminId?: string }): Promise<CompanyEntity | null>;
  findByStatus(status: CompanyStatus): Promise<CompanyEntity | null>;
  create(company: CompanyEntity): Promise<CompanyEntity>;
  save(company: CompanyEntity): Promise<CompanyEntity>;
  update(id: string, name: string): Promise<CompanyEntity | null>;
  delete(id: string): Promise<CompanyEntity | null>;
  findByAdminId(adminId: string, limit: number, offset: number): Promise<{ data: CompanyEntity[], total: number }>;
  findWithoutAdmin(adminId: string, limit: number, offset: number): Promise<{ data: CompanyEntity[], total: number }>;
}