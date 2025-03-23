import { ApiProperty } from '@nestjs/swagger';
import { JwtTokensResponse } from 'src/application/core/dto/jwt-tokens.dto';
import { AdminResponseDto } from './admin-response.dto';

export class AdminSuccessAuthResponce {
  @ApiProperty()
  admin: AdminResponseDto;

  @ApiProperty()
  tokens: JwtTokensResponse;
}