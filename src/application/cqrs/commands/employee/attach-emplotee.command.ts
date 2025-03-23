export class AttachEmployeeToCompanyCommand {
    constructor(
      public readonly employeeId: string,
      public readonly companyId: string,
      public readonly position: string,
      public readonly adminId: string
    ) {}
  }