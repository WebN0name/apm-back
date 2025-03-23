export class DeleteEmployeeCommand {
    constructor(
        public readonly employeeId: string,
        public readonly adminId: string
    ) {}
}