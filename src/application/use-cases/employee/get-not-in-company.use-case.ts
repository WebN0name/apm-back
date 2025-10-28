import { QueryHandler } from "@nestjs/cqrs";
import { IQueryHandler } from "src/application/core/use-case/use-case.interface";
import { GetEmployeesNotInCompanyQuery } from "src/application/cqrs/queries/employee/get-non-in-company-employees.command";
import EmployeeEntity from "src/domain/entities/employee.entity";
import { Inject } from "@nestjs/common";
import { IEmployeeRepository } from "src/domain/repositories/employee.repository";

@QueryHandler(GetEmployeesNotInCompanyQuery)
export class GetEmployeesNotInCompanyHandler implements IQueryHandler<GetEmployeesNotInCompanyQuery, { data: EmployeeEntity[]; total: number }> {
    constructor(@Inject("IEmployeeRepository") private readonly employeeRepository: IEmployeeRepository) {}

    async execute(query: GetEmployeesNotInCompanyQuery): Promise<{ data: EmployeeEntity[], total: number }> {
        return this.employeeRepository.findNotInCompany(query.companyId, query.offset, query.limit);
    }
}