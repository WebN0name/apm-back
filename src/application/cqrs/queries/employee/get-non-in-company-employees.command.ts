export class GetEmployeesNotInCompanyQuery {
    constructor(
        public readonly companyId: string,
        public readonly offset: number,
        public readonly limit: number
    ) {}
}