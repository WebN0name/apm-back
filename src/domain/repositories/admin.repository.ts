import AdminEntity from "src/domain/entities/admin.entity";

export interface IAdminRepository {
  findById(id: string): Promise<AdminEntity | null>;
  findByIdWithCompanies(id: string): Promise<AdminEntity>;
  findByEmail(email: string): Promise<AdminEntity | null>;
  attachToCompany(adminId: string, companyId: string): Promise<AdminEntity>;
  detachFromCompany(adminId: string, companyId: string): Promise<AdminEntity>;
  create(admin: AdminEntity): Promise<AdminEntity>;
  save(admin: AdminEntity): Promise<AdminEntity>;
}