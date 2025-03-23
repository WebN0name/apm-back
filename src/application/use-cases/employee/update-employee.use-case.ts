import { CommandHandler } from "@nestjs/cqrs";
import { Inject, ConflictException, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { IUseCase } from "src/application/core/use-case/use-case.interface";
import { UpdateEmployeeCommand } from "src/application/cqrs/commands/employee/update-employee.command";
import { IEmployeeRepository } from "src/domain/repositories/employee.repository";
import { ICompanyEmployeeRepository } from "src/domain/repositories/company-employee.repository";
import { IAdminRepository } from "src/domain/repositories/admin.repository";
import EmployeeEntity from "src/domain/entities/employee.entity";

@CommandHandler(UpdateEmployeeCommand)
export class UpdateEmployeeUseCase implements IUseCase<UpdateEmployeeCommand, EmployeeEntity> {
    constructor(
        @Inject("IEmployeeRepository") private readonly employeeRepository: IEmployeeRepository,
        @Inject("ICompanyEmployeeRepository") private readonly companyEmployeeRepository: ICompanyEmployeeRepository,
        @Inject("IAdminRepository") private readonly adminRepository: IAdminRepository,
        private readonly dataSource: DataSource
    ) {}

    async execute(command: UpdateEmployeeCommand): Promise<EmployeeEntity> {
        const { employeeId, firstName, surName, email, position, companyId } = command;

        return this.dataSource.transaction(async () => {
            const employee = await this.employeeRepository.findOne({ id: employeeId });
            if (!employee) throw new NotFoundException("Сотрудник не найден");

            if (email) {
                const [existingEmployee, existingAdmin] = await Promise.all([
                    this.employeeRepository.findOne({ email }),
                    this.adminRepository.findByEmail(email)
                ]);

                if (existingEmployee && existingEmployee.id !== employeeId) {
                    throw new ConflictException("Email уже используется другим сотрудником");
                }
                if (existingAdmin) {
                    throw new ConflictException("Email уже используется администратором");
                }

                employee.email = email;
            }


            if (firstName) employee.firstName = firstName;
            if (surName) employee.surName = surName;

            console.log(employee)
            const updatedEmployee = await this.employeeRepository.save(employee);

            if (position && companyId) {
                const companyEmployee = await this.companyEmployeeRepository.findOne({ companyId, employeeId });
                if (!companyEmployee) throw new NotFoundException("Сотрудник не привязан к компании");

                companyEmployee.position = position;

                await this.companyEmployeeRepository.save(companyEmployee);
            }

            return updatedEmployee;
        });
    }
}