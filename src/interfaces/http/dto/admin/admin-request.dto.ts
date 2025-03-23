import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class RequestAdminData {
    @ApiProperty({ example: "1", description: "ID администратора" })
    @Expose()
    id: string;

    @ApiProperty({ example: "johndoe", description: "Имя пользователя администратора" })
    @Expose()
    username: string;

    @ApiProperty({ example: "johndoe@example.com", description: "Email администратора" })
    @Expose()
    email: string;
}

export class RequestAdmin {
    @ApiProperty()
    user: RequestAdminData;
  }