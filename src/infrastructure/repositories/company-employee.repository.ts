import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import CompanyEmployeeEntity from "src/domain/entities/company-employee.entity";
import { ICompanyEmployeeRepository } from "src/domain/repositories/company-employee.repository";
import { CompanyEmployee } from "../database/entities/company-employee.entity";

@Injectable()
export class CompanyEmployeeRepository implements ICompanyEmployeeRepository {
    constructor(
        @InjectRepository(CompanyEmployee)
        private readonly repository: Repository<CompanyEmployeeEntity>
    ) { }

    async findByEmployeeAndCompany(employeeId: string, companyId: string): Promise<CompanyEmployeeEntity | null> {
        return this.repository.findOne({
            where: { employeeId, companyId },
        });
    }

    async create(employeeId: string, companyId: string, position: string): Promise<CompanyEmployeeEntity> {
        return this.repository.create({
            employeeId,
            companyId,
            position,
        });
    }

    async save(companyEmployee: CompanyEmployeeEntity): Promise<CompanyEmployeeEntity> {
        return this.repository.save(companyEmployee);
    }

    async countByEmployee(employeeId: string): Promise<number> {
        return this.repository.count({
            where: { employeeId },
        });
    }

    async findOne(filter: Partial<CompanyEmployeeEntity>): Promise<CompanyEmployeeEntity | null> {
        return this.repository.findOne({ where: filter });
    }

    async delete(employeeId: string, companyId: string): Promise<void> {
        const entity = await this.repository.findOne({ where: { employeeId, companyId } });
        if (entity) {
          await this.repository.remove(entity);
        }
      }
}