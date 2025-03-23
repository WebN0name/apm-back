import { Entity, Unique, ManyToOne, Column, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./company.entity";
import { Employee } from "./employee.entity";

@Entity()
@Unique(['employee', 'company'])
export class CompanyEmployee {
  @PrimaryColumn()
  employeeId: string;

  @PrimaryColumn()
  companyId: string;

  @ManyToOne(() => Employee, (employee) => employee.companies)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @ManyToOne(() => Company, (company) => company.employees)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  position: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}