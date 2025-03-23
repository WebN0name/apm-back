export class UpdateCompanyCommand {
    constructor(public readonly companyId: string, public readonly name: string, public readonly adminId: string) {}
}