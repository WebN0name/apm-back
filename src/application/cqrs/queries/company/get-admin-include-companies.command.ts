export class GetAdminCompaniesQuery {
    constructor(
        public readonly adminId: string,
        public readonly limit: number,
        public readonly offset: number
    ) {}
}