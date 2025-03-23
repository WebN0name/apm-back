export class DetachAdminFromCompanyCommand {
    constructor(public readonly adminId: string, public readonly companyId: string) {}
}