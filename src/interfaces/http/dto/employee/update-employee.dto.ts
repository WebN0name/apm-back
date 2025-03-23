import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsUUID, IsOptional } from "class-validator";

export class UpdateEmployeeDto {
    @ApiProperty({ example: "Иван", description: "Имя сотрудника" })
    @IsString()
    @IsOptional()
    firstName: string;

    @ApiProperty({ example: "Иванов", description: "Фамилия сотрудника" })
    @IsString()
    @IsOptional()
    surName: string;

    @ApiProperty({ example: "ivanov@example.com", description: "Email сотрудника" })
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty({ example: "Менеджер", description: "Должность сотрудника" })
    @IsString()
    @IsOptional()
    position: string;

    
    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", description: "ID компании" })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    companyId: string;
}