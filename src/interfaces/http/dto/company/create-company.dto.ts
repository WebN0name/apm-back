import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCompanyDto {
  @ApiProperty({ example: "Tech Corp", description: "Название компании" })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}