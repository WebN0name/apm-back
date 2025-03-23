import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Employee } from "../database/entities/employee.entity";
import EmployeeEntity from "src/domain/entities/employee.entity";
import EmployeeMapper from "../database/mappers/employee.mapper";
import { IEmployeeRepository } from "src/domain/repositories/employee.repository";

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
        private readonly dataSource: DataSource
    ) { }

    async findById(id: string): Promise<EmployeeEntity | null> {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: ["companies"],
        });

        return employee ? EmployeeMapper.toDomain(employee) : null;
    }

    async findByEmail(email: string): Promise<EmployeeEntity | null> {
        const employee = await this.employeeRepository.findOne({
            where: { email },
            relations: ["companies"],
        });

        return employee ? EmployeeMapper.toDomain(employee) : null;
    }

    async create(employee: EmployeeEntity): Promise<EmployeeEntity> {
        const newEmployee = this.employeeRepository.create(EmployeeMapper.toPersistence(employee));
        const savedEmployee = await this.employeeRepository.save(newEmployee);
        return EmployeeMapper.toDomain(savedEmployee);
    }

    async findOne(filter: Partial<EmployeeEntity>): Promise<EmployeeEntity | null> {
        return this.employeeRepository.findOne({ where: filter });
    }

    async findByCompanyId(
        companyId: string,
        offset: number,
        limit: number,
        search?: string
    ): Promise<{ data: any[]; total: number }> {
        const params: any[] = [companyId];
        let searchCondition = '';

        if (search) {
            searchCondition = `AND (
            LOWER(employee."firstName") LIKE LOWER($${params.length + 1}) 
            OR LOWER(employee."surName") LIKE LOWER($${params.length + 1}) 
            OR LOWER(employee."email") LIKE LOWER($${params.length + 1})
          )`;
            params.push(`%${search}%`);
        }

        const totalQuery = `
          SELECT COUNT(DISTINCT employee.id) AS count
          FROM employee
          INNER JOIN company_employee ON company_employee."employeeId" = employee.id
          WHERE company_employee."companyId" = $1 ${searchCondition}`;

        const totalResult = await this.employeeRepository.query(totalQuery, params);
        const total = parseInt(totalResult[0]?.count || "0", 10);

        params.push(offset, limit);

        const subQuery = `
          SELECT employee.id
          FROM employee
          INNER JOIN company_employee ON company_employee."employeeId" = employee.id
          WHERE company_employee."companyId" = $1 ${searchCondition}
          ORDER BY employee."createdAt" DESC
          OFFSET $${params.length - 1} LIMIT $${params.length}`;

        const subIdsRaw = await this.employeeRepository.query(subQuery, params);
        const ids = subIdsRaw.map((r) => r.id);

        if (!ids.length) {
            return { data: [], total };
        }

        const dataQuery = `
          SELECT 
              employee.id,
              employee."firstName",
              employee."surName",
              employee.email,
              employee."createdAt",
              employee."updatedAt",
              company_employee.position
          FROM employee
          INNER JOIN company_employee ON company_employee."employeeId" = employee.id
          WHERE employee.id = ANY($1)
          ORDER BY employee."createdAt" DESC`;

        const rawData = await this.employeeRepository.query(dataQuery, [ids]);

        const data = rawData.map((row) => ({
            id: row.id,
            firstName: row.firstName,
            surName: row.surName,
            email: row.email,
            position: row.position,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        }));

        return { data, total };
    }
    async findNotInCompany(
        companyId: string,
        offset: number,
        limit: number
      ): Promise<{ data: EmployeeEntity[]; total: number }> {
        const totalQuery = `
          SELECT COUNT(*) AS count
          FROM employee e
          WHERE e.id NOT IN (
            SELECT ce."employeeId"
            FROM company_employee ce
            WHERE ce."companyId" = $1
          )
          AND e.id IN (
            SELECT ce."employeeId"
            FROM company_employee ce
            GROUP BY ce."employeeId"
            HAVING COUNT(ce."companyId") < 2
          )
        `;
        const totalResult = await this.dataSource.query(totalQuery, [companyId]);
        const total = parseInt(totalResult[0].count, 10);
      
        const dataQuery = `
          SELECT *
          FROM employee e
          WHERE e.id NOT IN (
            SELECT ce."employeeId"
            FROM company_employee ce
            WHERE ce."companyId" = $1
          )
          AND e.id IN (
            SELECT ce."employeeId"
            FROM company_employee ce
            GROUP BY ce."employeeId"
            HAVING COUNT(ce."companyId") < 2
          )
          ORDER BY e."createdAt" DESC
          OFFSET $2 LIMIT $3
        `;
        const data = await this.dataSource.query(dataQuery, [companyId, offset, limit]);
      
        return { data, total };
      }

    async save(employee: EmployeeEntity): Promise<EmployeeEntity> {
        const updatedEmployee = await this.employeeRepository.save(employee);
        return updatedEmployee
    }

    async delete(id: string): Promise<void> {
        await this.employeeRepository.delete({ id });
    }
}