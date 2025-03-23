import { Expose, Type } from "class-transformer";
import EmployeeEntity from "./employee.entity";
import CompanyEntity from "./company.entity";

export default class CompanyEmployeeEntity {
    constructor(props: Partial<CompanyEmployeeEntity>) {
        Object.assign(this, props);
    }

    @Expose()
    employeeId: string;

    @Expose()
    companyId: string;

    @Expose()
    position: string;

    @Expose()
    @Type(() => EmployeeEntity)
    employee: EmployeeEntity;

    @Expose()
    @Type(() => CompanyEntity)
    company: CompanyEntity;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}