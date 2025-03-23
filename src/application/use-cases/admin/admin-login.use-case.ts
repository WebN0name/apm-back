import { CommandHandler } from "@nestjs/cqrs";
import { LoginAdminCommand } from "src/application/cqrs/commands/admin/login-admin.command";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import { TokenService } from "src/infrastructure/auth/token.service";
import { AdminSuccessAuthResponce } from "src/interfaces/http/dto/admin/admin-with-tokens-response.dto";
import { Inject, NotFoundException } from "@nestjs/common";
import { InjectAdminRepository } from "src/domain/shared/repository/inject-admin-repository";
import { InjectTokenService } from "src/domain/shared/service/inject-token-service";
import AdminEntity from "src/domain/entities/admin.entity";
import AdminMapper from "src/infrastructure/database/mappers/admin.mapper";
import { IUseCase } from "src/application/core/use-case/use-case.interface";

@CommandHandler(LoginAdminCommand)
export class LoginAdminUseCase implements IUseCase<LoginAdminCommand, AdminSuccessAuthResponce> {
  constructor(
    @Inject(InjectAdminRepository) private readonly adminRepository: IAdminRepository,
    @Inject(InjectTokenService) private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginAdminCommand): Promise<AdminSuccessAuthResponce> {
    const { email, password } = command;

    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new NotFoundException("Администратор не найден");
    }

    await AdminEntity.checkPassword({
        requestPassword: password,
        userEntityPasword: admin.password!,
      });

    const tokens = await this.tokenService.getTokens(admin.email, admin.id, admin.username);

    return { admin: AdminMapper.toTokenResponse(admin), tokens };
  }
}