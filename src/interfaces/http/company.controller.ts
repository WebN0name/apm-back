import { Post, HttpCode, Body, Controller, Delete, Param, Patch, Req, Get, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateCompanyCommand } from "src/application/cqrs/commands/company/create-company.commands";
import CompanyEntity from "src/domain/entities/company.entity";
import { CreateCompanyDto } from "./dto/company/create-company.dto";
import { UpdateCompanyDto } from "./dto/company/update-company.dto";
import { AccessJwtAuthGuard } from "src/infrastructure/auth/guards/access-jwt-auth.guard";
import { RequestAdmin } from "./dto/admin/admin-request.dto";
import { DeleteCompanyCommand } from "src/application/cqrs/commands/company/delete-company.command";
import { UpdateCompanyCommand } from "src/application/cqrs/commands/company/update-company.command";
import { PaginationDto } from "src/application/core/dto/pagination.dto";
import { GetAdminCompaniesQuery } from "src/application/cqrs/queries/company/get-admin-include-companies.command";
import { GetCompaniesWithoutAdminQuery } from "src/application/cqrs/queries/company/get-admin-exclude-companies.command";

@ApiTags('companies')
@Controller('companies')
@AccessJwtAuthGuard()
export class CompanyController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Get('/admin-include')
    @HttpCode(200)
    @AccessJwtAuthGuard()
    async getAdminCompanies(
        @Req() { user }: RequestAdmin,
        @Query() pagination: PaginationDto
    ): Promise<{ data: CompanyEntity[], total: number }> {
        return this.queryBus.execute(new GetAdminCompaniesQuery(user.id, Number(pagination.limit), Number(pagination.offset)));
    }

    @Get('/admin-exclude')
    @HttpCode(200)
    async getCompaniesWithoutAdmin(
      @Req() { user }: RequestAdmin,
      @Query() pagination: PaginationDto
    ): Promise<{ data: CompanyEntity[]; total: number }> {
      return this.queryBus.execute(new GetCompaniesWithoutAdminQuery(user.id, Number(pagination.limit), Number(pagination.offset)));
    }

    @Post('/')
    @HttpCode(201)
    @ApiResponse({ status: 201, type: CompanyEntity })
    async createCompany(@Req() { user }: RequestAdmin, @Body() body: CreateCompanyDto): Promise<CompanyEntity> {
        return this.commandBus.execute(new CreateCompanyCommand(body.name, user.id));
    }

    @Delete("/:id")
    @HttpCode(204)
    async deleteCompany(@Req() { user }: RequestAdmin, @Param("id") id: string): Promise<CompanyEntity> {
        return await this.commandBus.execute(new DeleteCompanyCommand(id, user.id));
    }

    @Patch("/:id")
    @AccessJwtAuthGuard()
    @ApiResponse({ status: 200, type: CompanyEntity })
    async updateCompany(@Req() { user }: RequestAdmin, @Param("id") id: string, @Body() body: UpdateCompanyDto): Promise<CompanyEntity> {
        return this.commandBus.execute(new UpdateCompanyCommand(id, body.name, user.id));
    }
}