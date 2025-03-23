import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ICompanyRepository } from "src/domain/repositories/company.repository";
import { In, Repository } from "typeorm";
import { Company, CompanyStatus } from "../database/entities/company.entity";
import CompanyEntity from "src/domain/entities/company.entity";

@Injectable()
export class CompanyRepository implements ICompanyRepository {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) { }

    async findById(id: string): Promise<CompanyEntity | null> {
        const company = await this.companyRepository.findOne({
            where: { id },
            relations: ["admins", "employees"],
        });
        return company ? new CompanyEntity(company) : null;
    }

    async findByName(name: string): Promise<CompanyEntity | null> {
        const company = await this.companyRepository.findOne({
            where: { name },
            relations: ["admins", "employees"],
        });
        return company ? new CompanyEntity(company) : null;
    }

    async create(company: CompanyEntity): Promise<CompanyEntity> {
        const newCompany = this.companyRepository.create(company);
        const savedCompany = await this.companyRepository.save(newCompany);
        return new CompanyEntity(savedCompany);
    }

    async save(company: CompanyEntity): Promise<CompanyEntity> {
        const updatedCompany = await this.companyRepository.save(company);
        return new CompanyEntity(updatedCompany);
    }

    async findByIds(ids: string[]): Promise<CompanyEntity[]> {
        const companies = await this.companyRepository.find({
            where: { id: In(ids) },
            relations: ["admins", "employees"],
        });

        return companies.map(company => new CompanyEntity(company));
    }

    async update(id: string, name: string): Promise<CompanyEntity | null> {
        const company = await this.findById(id);
        if (!company) return null;
        company.name = name;
        return this.save(company);
    }

    async delete(id: string): Promise<CompanyEntity | null> {
        const company = await this.findById(id);
        if (!company) return null;
        await this.companyRepository.delete(id);
        return company;
    }

    async findByAdminId(adminId: string, limit: number, offset: number): Promise<{ data: CompanyEntity[], total: number }> {
        const [data, total] = await this.companyRepository
            .createQueryBuilder("company")
            .leftJoin("company.admins", "admin", "admin.id = :adminId", { adminId })
            .where("admin.id = :adminId OR company.status = :defaultStatus", { adminId, defaultStatus: CompanyStatus.DEFAULT })
            .take(limit)
            .skip(offset)
            .orderBy("company.name", "ASC")
            .getManyAndCount();
    
        return { data, total };
    }
    
    async findWithoutAdmin(adminId: string, limit: number, offset: number): Promise<{ data: Company[], total: number }> {
        const [data, total] = await this.companyRepository
          .createQueryBuilder("company")
          .where("company.status != :defaultStatus", { defaultStatus: CompanyStatus.DEFAULT })
          .andWhere(qb => {
            const subQuery = qb.subQuery()
              .select("company_sub.id")
              .from(Company, "company_sub")
              .innerJoin("company_sub.admins", "admin_sub")
              .where("admin_sub.id = :adminId", { adminId })
              .getQuery();
            return "company.id NOT IN " + subQuery;
          })
          .orderBy("company.createdAt", "ASC")
          .skip(offset)
          .take(limit)
          .getManyAndCount();
      
        return { data, total };
      }

    async findOne(criteria: { id?: string; adminId?: string }): Promise<CompanyEntity | null> {
        const query = this.companyRepository.createQueryBuilder("company");

        if (criteria.id) {
            query.andWhere("company.id = :id", { id: criteria.id });
        }

        if (criteria.adminId) {
            query.innerJoin("company.admins", "admin").andWhere("admin.id = :adminId", { adminId: criteria.adminId });
        }

        return query.getOne();
    }

    async findByStatus(status: CompanyStatus): Promise<CompanyEntity | null> {
        return this.companyRepository.findOne({ where: { status } });
    }
}