import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshJwtStrategyAlias } from '../strategies/refresh-token.strategy';

export const RefreshJwtAuthGuard = () => {
  return applyDecorators(UseGuards(AuthGuard(RefreshJwtStrategyAlias)), ApiBearerAuth('refresh-token'));
};
