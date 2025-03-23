import { ApiProperty } from '@nestjs/swagger';

class JWTTokenResponse {
  @ApiProperty({ required: true })
  token: string;

  @ApiProperty({ required: true })
  expiresIn: number;
}

export class JwtTokensResponse {
  @ApiProperty({ required: true, type: JWTTokenResponse })
  accessToken: JWTTokenResponse;

  @ApiProperty({ required: true, type: JWTTokenResponse })
  refreshToken: JWTTokenResponse;
}

export class JWTAccessTokenResponse {
  @ApiProperty({ required: true, type: JWTTokenResponse })
  accessToken: JWTTokenResponse;
}
