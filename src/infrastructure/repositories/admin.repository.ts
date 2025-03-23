import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "../database/entities/admin.entity";
import AdminEntity from "src/domain/entities/admin.entity";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import AdminMapper from "../database/mappers/admin.mapper";

@Injectable()
export class AdminRepository implements IAdminRepository {
    constructor(@InjectRepository(Admin) private readonly repo: Repository<Admin>) { }

    async findById(id: string): Promise<AdminEntity | null> {
        const admin = await this.repo.findOne({ where: { id }, relations: ["companies"] });
        return admin ? AdminMapper.toDomain(admin) : null;
    }

    async findByEmail(email: string): Promise<AdminEntity | null> {
        const admin = await this.repo.findOne({ where: { email }, relations: ["companies"] });
        return admin ? AdminMapper.toDomain(admin) : null;
    }

    async findByIdWithCompanies(id: string): Promise<AdminEntity> {
        const admin = await this.repo.findOne({
            where: { id },
            relations: ["companies"],
        });

        if (!admin) throw new NotFoundException('Админ не найден')

        return AdminMapper.toDomain(admin)
    }

    async attachToCompany(adminId: string, companyId: string): Promise<AdminEntity> {
        await this.repo
            .createQueryBuilder()
            .relation(Admin, "companies")
            .of(adminId)
            .add(companyId);

        return this.findByIdWithCompanies(adminId);
    }

    async detachFromCompany(adminId: string, companyId: string): Promise<AdminEntity> {
        await this.repo
            .createQueryBuilder()
            .relation(Admin, "companies")
            .of(adminId)
            .remove(companyId);

        return this.findByIdWithCompanies(adminId);
    }

    async create(adminEntity: AdminEntity): Promise<AdminEntity> {
        const admin = this.repo.create(adminEntity);
        const savedAdmin = await this.repo.save(admin);
        return AdminMapper.toPersistence(savedAdmin);
    }

    async save(adminEntity: AdminEntity): Promise<AdminEntity> {
        const updatedAdmin = await this.repo.save(AdminMapper.toPersistence(adminEntity));
        return AdminMapper.toDomain(updatedAdmin);
    }
}