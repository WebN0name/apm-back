import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TokenService } from "src/infrastructure/auth/token.service";
import { AdminSuccessAuthResponce } from "src/interfaces/http/dto/admin/admin-with-tokens-response.dto";
import { UnauthorizedException, Inject } from "@nestjs/common";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import { InjectAdminRepository } from "src/domain/shared/repository/inject-admin-repository";
import { RefreshTokenCommand } from "src/application/cqrs/commands/admin/refresh-token-admin.command";
import AdminMapper from "src/infrastructure/database/mappers/admin.mapper";
import { IUseCase } from "src/application/core/use-case/use-case.interface";

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements IUseCase<RefreshTokenCommand, AdminSuccessAuthResponce> {
  constructor(
    @Inject(InjectAdminRepository) private readonly adminRepository: IAdminRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(command: RefreshTokenCommand): Promise<AdminSuccessAuthResponce> {
    const { adminId } = command;

    const admin = await this.adminRepository.findById(adminId);
    if (!admin) {
      throw new UnauthorizedException("Администратор не найден");
    }

    const tokens = await this.tokenService.getTokens(admin.email, admin.id, admin.username);

    return { admin: AdminMapper.toTokenResponse(admin), tokens };
  }
}