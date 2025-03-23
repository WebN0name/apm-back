import { Expose, Type } from "class-transformer";
import AdminEntity from "./admin.entity";
import { Entity } from "../shared/entity.shared";
import CompanyEmployeeEntity from "./company-employee.entity";
import { CompanyStatus } from "src/infrastructure/database/entities/company.entity";

export default class CompanyEntity extends Entity<string> {
    constructor(props: Partial<CompanyEntity>) {
        super();
        Object.assign(this, props);
    }

    @Expose()
    name: string;

    @Expose()
    @Type(() => AdminEntity)
    admins: AdminEntity[];

    @Expose()
    @Type(() => CompanyEmployeeEntity)
    employees: CompanyEmployeeEntity[];

    @Expose()
    status: CompanyStatus;

    @Expose()
    public createdAt: Date;

    @Expose()
    public updatedAt: Date;
}