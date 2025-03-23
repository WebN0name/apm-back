import { ICommand } from "@nestjs/cqrs";

export class UpdateEmployeeCommand implements ICommand {
    constructor(
        public readonly employeeId: string,
        public readonly companyId: string,
        public readonly firstName?: string,
        public readonly surName?: string,
        public readonly email?: string,
        public readonly position?: string
    ) {}
}