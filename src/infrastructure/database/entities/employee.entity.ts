import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CompanyEmployee } from "./company-employee.entity";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  surName: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => CompanyEmployee, (companyEmployee) => companyEmployee.employee)
  companies: CompanyEmployee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}