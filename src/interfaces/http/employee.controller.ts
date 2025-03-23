import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateEmployeeDto } from "./dto/employee/create-employee.dto";
import EmployeeEntity from "src/domain/entities/employee.entity";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateEmployeeWithCompanyCommand } from "src/application/cqrs/commands/employee/create-employee.command";
import { RequestAdmin } from "./dto/admin/admin-request.dto";
import { AccessJwtAuthGuard } from "src/infrastructure/auth/guards/access-jwt-auth.guard";
import { AttachEmployeeDto } from "./dto/employee/attach-employee.dto";
import { AttachEmployeeToCompanyCommand } from "src/application/cqrs/commands/employee/attach-emplotee.command";
import { DetachEmployeeDto } from "./dto/employee/detach-employee.dto";
import { DetachEmployeeFromCompanyCommand } from "src/application/cqrs/commands/employee/detach-employee.command";
import CompanyEmployeeEntity from "src/domain/entities/company-employee.entity";
import { DeleteEmployeeCommand } from "src/application/cqrs/commands/employee/delete-employee.command";
import { EmployeeResponseDto } from "./dto/employee/employee-response.dto";
import { GetEmployeesByCompanyQuery } from "src/application/cqrs/queries/employee/get-employee-by-company.command";
import { PaginationDto } from "src/application/core/dto/pagination.dto";
import { UpdateEmployeeDto } from "./dto/employee/update-employee.dto";
import { UpdateEmployeeCommand } from "src/application/cqrs/commands/employee/update-employee.command";
import { GetEmployeesNotInCompanyQuery } from "src/application/cqrs/queries/employee/get-non-in-company-employees.command";
import { Employee } from "src/infrastructure/database/entities/employee.entity";

@ApiTags('employees')
@Controller('employees')
@AccessJwtAuthGuard()
export class EmployeeController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Get("/:companyId")
    @ApiQuery({ name: "search", required: false, example: "Иван", description: "Поиск по имени, фамилии или email" })
    async getEmployeesByCompany(
        @Param("companyId") companyId: string,
        @Query() pagination: PaginationDto,
        @Query("search") search = '',
    ): Promise<{ data: EmployeeResponseDto[]; total: number }> {
        return this.queryBus.execute(new GetEmployeesByCompanyQuery(companyId, Number(pagination.offset), Number(pagination.limit), search))
    }

    @Get("/:companyId/not-in")
    async getEmployeesNotInCompany(
        @Param("companyId") companyId: string,
        @Query() pagination: PaginationDto,
    ): Promise<{ data: Employee[]; total: number }> {
        return this.queryBus.execute(new GetEmployeesNotInCompanyQuery(companyId, Number(pagination.offset), Number(pagination.limit)));
    }

    @Post("/")
    @HttpCode(201)
    async createEmployee(
        @Req() { user }: RequestAdmin,
        @Body() body: CreateEmployeeDto
    ): Promise<EmployeeEntity> {
        return this.commandBus.execute(
            new CreateEmployeeWithCompanyCommand(body.firstName, body.surName, body.email, body.companyId, body.position, user.id)
        );
    }

    @Patch("/:employeeId/attach")
    @HttpCode(200)
    async attachEmployeeToCompany(
        @Param("employeeId") employeeId: string,
        @Req() { user }: RequestAdmin,
        @Body() body: AttachEmployeeDto
    ): Promise<CompanyEmployeeEntity> {
        return this.commandBus.execute(
            new AttachEmployeeToCompanyCommand(employeeId, body.companyId, body.position, user.id)
        );
    }

    @Patch("/:employeeId/detach")
    @HttpCode(200)
    async detachEmployeeFromCompany(
        @Param("employeeId") employeeId: string,
        @Req() { user }: RequestAdmin,
        @Body() body: DetachEmployeeDto
    ): Promise<CompanyEmployeeEntity> {
        return this.commandBus.execute(
            new DetachEmployeeFromCompanyCommand(employeeId, body.companyId, user.id)
        );
    }

    @Patch(":employeeId")
    @HttpCode(200)
    async updateEmployee(
        @Param("employeeId") employeeId: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto
    ) {
        return this.commandBus.execute(
            new UpdateEmployeeCommand(
                employeeId,
                updateEmployeeDto.companyId,
                updateEmployeeDto.firstName,
                updateEmployeeDto.surName,
                updateEmployeeDto.email,
                updateEmployeeDto.position,
            )
        );
    }

    @Delete("/:employeeId")
    @HttpCode(200)
    async deleteEmployee(
        @Param("employeeId") employeeId: string,
        @Req() { user }: RequestAdmin
    ): Promise<EmployeeEntity> {
        return this.commandBus.execute(new DeleteEmployeeCommand(employeeId, user.id));
    }
}