import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessJwtStrategyAlias } from '../strategies/access-token.strategy';

export const AccessJwtAuthGuard = () => {
  return applyDecorators(UseGuards(AuthGuard(AccessJwtStrategyAlias)), ApiBearerAuth('access-token'));
};
