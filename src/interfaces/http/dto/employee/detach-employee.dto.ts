import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class DetachEmployeeDto {
    @ApiProperty({ example: "ddd78443-bc8d-41b3-9145-6662dbc00d12", description: "ID компании, из которой нужно удалить сотрудника" })
    @IsUUID()
    companyId: string;
}