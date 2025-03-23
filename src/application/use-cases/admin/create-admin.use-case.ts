import { CommandHandler } from "@nestjs/cqrs";
import { IUseCase } from "src/application/core/use-case/use-case.interface";
import { CreateAdminCommand } from "src/application/cqrs/commands/admin/create-admin.command";
import CompanyEntity from "src/domain/entities/company.entity";
import AdminEntity from "src/domain/entities/admin.entity";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import { TokenService } from "src/infrastructure/auth/token.service";
import { AdminSuccessAuthResponce } from "src/interfaces/http/dto/admin/admin-with-tokens-response.dto";
import { IEmployeeRepository } from "src/domain/repositories/employee.repository";
import { ConflictException, Inject } from "@nestjs/common";
import { InjectAdminRepository } from "src/domain/shared/repository/inject-admin-repository";
import { InjectEmployeeRepository } from "src/domain/shared/repository/inject-employee-repository";
import { InjectTokenService } from "src/domain/shared/service/inject-token-service";

@CommandHandler(CreateAdminCommand)
export class CreateAdminUseCase implements IUseCase<CreateAdminCommand, AdminSuccessAuthResponce> {
  constructor(
    @Inject(InjectAdminRepository) private readonly adminRepository: IAdminRepository,
    @Inject(InjectEmployeeRepository) private readonly employeeRepository: IEmployeeRepository,
    @Inject(InjectTokenService) private readonly tokenService: TokenService,
  ) {}

  async execute(command: CreateAdminCommand): Promise<AdminSuccessAuthResponce> {
    const { email, username, password } = command;

    let companies: CompanyEntity[] = []

    const existingEmployee = await this.employeeRepository.findByEmail(email);
    if (existingEmployee) {
      throw new ConflictException("Сотрудник с таким email уже существует");
    }

    const existingAdmin = await this.adminRepository.findByEmail(email);
    if (existingAdmin) {
      throw new ConflictException("Администратор с таким email уже существует");
    }

    const admin = await AdminEntity.create({
        email,
        username,
        password,
        companies,
      });
  
      const savedAdmin = await this.adminRepository.create(admin);
  
      const tokens = await this.tokenService.getTokens(savedAdmin.email, savedAdmin.id, savedAdmin.username);
  
      return {admin: savedAdmin, tokens};
  }
}