export class DetachEmployeeFromCompanyCommand {
    constructor(
        public readonly employeeId: string,
        public readonly companyId: string,
        public readonly adminId: string
    ) {}
}