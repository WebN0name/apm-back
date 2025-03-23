import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AttachEmployeeDto {
    @ApiProperty({
      description: "Идентификатор компании, к которой прикрепляется сотрудник",
      example: "550e8400-e29b-41d4-a716-446655440000",
    })
    @IsUUID()
    @IsNotEmpty()
    companyId: string;
  
    @ApiProperty({
      description: "Должность сотрудника в компании",
      example: "Software Engineer",
    })
    @IsString()
    @IsNotEmpty()
    position: string;
  }