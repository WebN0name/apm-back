export class CreateCompanyCommand {
    constructor(public readonly name: string, public readonly adminId: string) {}
  }