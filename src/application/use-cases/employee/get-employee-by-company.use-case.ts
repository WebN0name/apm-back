import { QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { IEmployeeRepository } from "src/domain/repositories/employee.repository";
import { GetEmployeesByCompanyQuery } from "src/application/cqrs/queries/employee/get-employee-by-company.command";
import { EmployeeListResponseDto, EmployeeResponseDto } from "src/interfaces/http/dto/employee/employee-response.dto";
import { IQueryHandler } from "src/application/core/use-case/use-case.interface";
import { plainToInstance } from "class-transformer";

@QueryHandler(GetEmployeesByCompanyQuery)
export class GetEmployeesByCompanyUseCase implements IQueryHandler<GetEmployeesByCompanyQuery, { data: EmployeeResponseDto[]; total: number }> {
    constructor(@Inject("IEmployeeRepository") private readonly employeeRepository: IEmployeeRepository) { }

    async execute(
        query: GetEmployeesByCompanyQuery
    ): Promise<{ data: any; total: number }> {
        const { data, total } = await this.employeeRepository.findByCompanyId(
            query.companyId,
            query.offset,
            query.limit,
            query.search
        );

        const dataObj = Array.isArray(data)
            ? data.reduce((acc, item, index) => {
                acc[index] = item;
                return acc;
            }, {} as Record<string, any>)
            : data;

            const transformedData = data.map(item => 
                plainToInstance(EmployeeResponseDto, item, { excludeExtraneousValues: true })
              );
              
              const result = plainToInstance(EmployeeListResponseDto, { data: transformedData, total }, { excludeExtraneousValues: true });
              
              return result;
    }
}