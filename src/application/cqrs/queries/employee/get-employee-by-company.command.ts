export class GetEmployeesByCompanyQuery {
    constructor(
        public readonly companyId: string,
        public readonly offset: number,
        public readonly limit: number,
        public readonly search?: string,
    ) {}
}