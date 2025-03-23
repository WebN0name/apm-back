import { IsString, IsEmail, MinLength, IsUUID, ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin123', description: 'Уникальное имя администратора' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email администратора', uniqueItems: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePass123', description: 'Пароль администратора (минимум 6 символов)' })
  @IsString()
  @MinLength(6)
  password: string;
}