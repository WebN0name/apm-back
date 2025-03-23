import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CompanyEmployee } from "./company-employee.entity";
import { Admin } from "./admin.entity";

export enum CompanyStatus {
  CREATED = "created",
  DEFAULT = "default",
}

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Admin, (admin) => admin.companies, { cascade: true, onDelete: "CASCADE" })
  admins: Admin[];

  @OneToMany(() => CompanyEmployee, (companyEmployee) => companyEmployee.company)
  employees: CompanyEmployee[];

  @Column({
    type: "enum",
    enum: CompanyStatus,
    default: CompanyStatus.CREATED,
  })
  status: CompanyStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}