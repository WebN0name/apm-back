import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeDto {
    @ApiProperty({ example: "Иван", description: "Имя сотрудника" })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: "Иванов", description: "Фамилия сотрудника" })
    @IsString()
    @IsNotEmpty()
    surName: string;

    @ApiProperty({ example: "ivanov@example.com", description: "Email сотрудника" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000", description: "UUID компании" })
    @IsUUID()
    @IsNotEmpty()
    companyId: string;

    @ApiProperty({ example: "Менеджер", description: "Должность сотрудника" })
    @IsString()
    @IsNotEmpty()
    position: string;
}