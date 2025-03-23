import { Expose, Type } from "class-transformer";
import { Entity } from "../shared/entity.shared";
import CompanyEntity from "./company.entity";
import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

export interface IAdminCreationAttributes {
    email: string;
    password: string;
    username: string;
    companies?: CompanyEntity[];
}

export interface IUserCheckPasswordAttributes {
    requestPassword: string;
    userEntityPasword: string;
}


export default class AdminEntity extends Entity<string> {

    constructor(props: Partial<AdminEntity>) {
        super();
        Object.assign(this, props);
    }

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    public password?: string;

    @Expose()
    @Type(() => CompanyEntity)
    public companies: CompanyEntity[];

    @Expose()
    public createdAt: Date;

    @Expose()
    public updatedAt: Date;

    public static async create(creationAttributes: IAdminCreationAttributes): Promise<AdminEntity> {
        const fields = creationAttributes
        const passwordHash = await bcrypt.hash(creationAttributes.password, 10);
        fields.password = passwordHash;
        const user = new AdminEntity(fields);
        Object.keys(creationAttributes).forEach((key) => {
            user[key] = creationAttributes[key];
        });
        return user;
    }

    public static async checkPassword(checkPasswordAttributes: IUserCheckPasswordAttributes): Promise<boolean> {
        const isPassword = await bcrypt.compare(checkPasswordAttributes.requestPassword, checkPasswordAttributes.userEntityPasword);
        if (!isPassword) {
            throw new UnauthorizedException('access denied');
        }
        return true;
    }
}