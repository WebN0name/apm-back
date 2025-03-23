import { Expose, Type } from "class-transformer";
import { Entity } from "../shared/entity.shared";
import CompanyEmployeeEntity from "./company-employee.entity";

export default class EmployeeEntity extends Entity<string> {

    constructor(props: Partial<EmployeeEntity>) {
        super();
        Object.assign(this, props);
    }

    @Expose()
    firstName: string;

    @Expose()
    surName: string;

    @Expose()
    email: string;

    @Expose()
    @Type(() => CompanyEmployeeEntity)
    companies: CompanyEmployeeEntity[];

    @Expose()
    public createdAt: Date;

    @Expose()
    public updatedAt: Date;
}