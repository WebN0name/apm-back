export class CreateEmployeeWithCompanyCommand {
    constructor(
        public readonly firstName: string,
        public readonly surName: string,
        public readonly email: string,
        public readonly companyId: string,
        public readonly position: string,
        public readonly adminId: string
    ) {}
}