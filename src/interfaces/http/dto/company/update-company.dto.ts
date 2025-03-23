import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateCompanyDto {
    @ApiProperty({ example: "Tech Corp", description: "Название компании" })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;
}