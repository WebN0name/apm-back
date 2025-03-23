import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
    @ApiPropertyOptional({ example: 10, description: "Количество элементов на странице", minimum: 1, required: true })
    @IsInt()
    @Type(() => Number)
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ example: 0, description: "Смещение для пагинации", minimum: 0, required: true })
    @IsInt()
    @Type(() => Number)
    @Min(0)
    offset?: number = 0;
}