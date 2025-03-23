import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import CompanyEntity from "src/domain/entities/company.entity";

export  class AdminResponseDto {
  @ApiProperty({ example: "johndoe", description: "Имя пользователя администратора" })
  @Expose()
  username: string;

  @ApiProperty({ example: "johndoe@example.com", description: "Email администратора" })
  @Expose()
  email: string;

  @ApiProperty({ example: "2025-03-19T12:00:00.000Z", description: "Дата создания аккаунта" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: "2025-03-19T12:00:00.000Z", description: "Дата последнего обновления" })
  @Expose()
  updatedAt: Date;
}

export  class AdminResponseWithCompaniesDto extends AdminResponseDto{
    @ApiProperty({ type: [CompanyEntity], description: "Компании, к которым привязан администратор" })
    @Expose()
    @Type(() => CompanyEntity)
    companies: CompanyEntity[];
}