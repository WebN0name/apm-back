import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email администратора',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePass123',
    description: 'Пароль администратора (минимум 6 символов)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}