export class DeleteCompanyCommand {
    constructor(public readonly companyId: string, public readonly adminId: string) {}
}