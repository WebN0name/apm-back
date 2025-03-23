import { Body, Controller, Get, HttpCode, Param, Patch, Post, Req } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateAdminDto } from "./dto/admin/sign-up.dto";
import { CreateAdminCommand } from "src/application/cqrs/commands/admin/create-admin.command";
import { ApiTags } from "@nestjs/swagger";
import { LoginAdminDto } from "./dto/admin/login-admin.dto";
import { AdminSuccessAuthResponce } from "./dto/admin/admin-with-tokens-response.dto";
import { LoginAdminCommand } from "src/application/cqrs/commands/admin/login-admin.command";
import { RefreshJwtAuthGuard } from "src/infrastructure/auth/guards/refresh-jwt-auth.guard";
import { RequestAdmin } from "./dto/admin/admin-request.dto";
import { RefreshTokenCommand } from "src/application/cqrs/commands/admin/refresh-token-admin.command";
import { AccessJwtAuthGuard } from "src/infrastructure/auth/guards/access-jwt-auth.guard";
import { GetAdminWithCompaniesQuery } from "src/application/cqrs/queries/admin/get-admin.query";
import { AdminResponseDto } from "./dto/admin/admin-response.dto";
import { AttachAdminToCompanyCommand } from "src/application/cqrs/commands/admin/attach-admin-to-company.command";
import { DetachAdminFromCompanyCommand } from "src/application/cqrs/commands/admin/detach-admin-to-company.command";
import { Company } from "src/infrastructure/database/entities/company.entity";

@ApiTags('admins')
@Controller('admins')
export class AdminController {
    constructor(
        private readonly commandBus: CommandBus, 
        private readonly queryBus: QueryBus
    ) { }

    @Post('/sign-up')
    @HttpCode(201)
    async adminSignUp(@Body() body: CreateAdminDto) {
        const { username, email, password } = body;
        return this.commandBus.execute(new CreateAdminCommand(username, email, password));
    }

    @Post('/login')
    @HttpCode(200)
    async loginAdmin(@Body() loginAdminDto: LoginAdminDto): Promise<AdminSuccessAuthResponce> {
        const { email, password } = loginAdminDto;
        return this.commandBus.execute(new LoginAdminCommand(email, password));
    }

    @Get('/refresh-token')
    @RefreshJwtAuthGuard()
    @HttpCode(200)
    async refreshToken(@Req() { user }: RequestAdmin): Promise<AdminSuccessAuthResponce> {
        return this.commandBus.execute(new RefreshTokenCommand(user.id));
    }

    @Get('/')
    @AccessJwtAuthGuard()
    @HttpCode(200)
    async getAdmin(@Req() { user }: RequestAdmin): Promise<AdminResponseDto> {
        return await this.queryBus.execute(new GetAdminWithCompaniesQuery(user.id));
    }

    @Patch("/:companyId/attach")
    @AccessJwtAuthGuard()
    @HttpCode(200)
    async attachToCompany(@Req() { user }: RequestAdmin, @Param("companyId") companyId: string): Promise<Company> {
        return await this.commandBus.execute(new AttachAdminToCompanyCommand(user.id, companyId));
    }

    @Patch("/:companyId/detach")
    @AccessJwtAuthGuard()
    @HttpCode(200)
    async detachFromCompany(@Req() { user }: RequestAdmin, @Param("companyId") companyId: string): Promise<AdminResponseDto> {
        return await this.commandBus.execute(new DetachAdminFromCompanyCommand(user.id, companyId));
    }
}