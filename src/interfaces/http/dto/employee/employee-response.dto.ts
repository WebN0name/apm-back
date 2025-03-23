import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class EmployeeResponseDto {
    @ApiProperty({ example: "ddd78443-bc8d-41b3-9145-6662dbc00d12", description: "ID компании, из которой нужно удалить сотрудника" })
    @Expose()
    id: string;

    @ApiProperty({ example: "Иван", description: "Имя сотрудника" })
    @Expose()
    firstName: string;

    @ApiProperty({ example: "Петров", description: "Фамилия сотрудника" })
    @Expose()
    surName: string;

    @ApiProperty({ example: "ivan.petrov@example.com", description: "Email сотрудника" })
    @Expose()
    email: string;

    @ApiProperty({ example: "Менеджер", description: "Должность сотрудника" })
    @Expose()
    position: string;

    @ApiProperty({ example: "2024-01-01T10:00:00.000Z", description: "Дата создания сотрудника", type: String, format: "date-time" })
    @Expose()
    createdAt: Date;

    @ApiProperty({ example: "2024-03-20T12:00:00.000Z", description: "Дата обновления сотрудника", type: String, format: "date-time" })
    @Expose()
    updatedAt: Date;
}

export class EmployeeListResponseDto {
    @Expose()
    @Type(() => EmployeeResponseDto)
    data: EmployeeResponseDto[];

    @Expose()
    total: number;

    constructor(data: EmployeeResponseDto[], total: number) {
        this.data = data;
        this.total = total;
    }
}