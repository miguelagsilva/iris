import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  Unique,
  OneToOne,
} from 'typeorm';
import { IsString, Length, IsUUID, Matches, IsNotEmpty } from 'class-validator';
import { Organization } from '../organizations/organization.entity';
import { Employee } from '../employees/employee.entity';
import { SafeGroupDto } from './dto/safe-group.dto';
import { Exclude, plainToInstance } from 'class-transformer';
import { Assistant } from '../ai/assistants/entities/assistant.entity';
import { SafeEmployeeDto } from 'src/employees/dto/safe-employee.dto';

@Entity()
@Unique(['name'])
export class Group {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  name: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.groups, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @ManyToMany(() => Employee, (employee) => employee.groups)
  employees: Employee[];

  @OneToOne(() => Assistant, (assistant) => assistant.group)
  assistant: Assistant;

  toSafeGroup(): SafeGroupDto {
    const safeGroup = plainToInstance(SafeGroupDto, this, {
      excludeExtraneousValues: true,
    });

    safeGroup.employees = this.employees
      ? this.employees.map((e) =>
          plainToInstance(SafeEmployeeDto, e, {
            excludeExtraneousValues: true,
          }),
        )
      : [];

    return safeGroup;
  }

  getEmployees(): Employee[] {
    return this.employees || [];
  }

  addEmployee(employee: Employee): Employee[] {
    if (!this.employees) {
      this.employees = [];
    }
    if (
      !this.employees.some((e) => e.id == employee.id) &&
      employee.organization &&
      employee.organization.id == this.organization.id
    ) {
      this.employees.push(employee);
      if (!employee.groups) {
        employee.groups = [];
      }
      employee.groups.push(this);
    }
    return this.employees;
  }

  removeEmployee(employee: Employee): Employee[] {
    if (!this.employees) {
      return [];
    }
    this.employees = this.employees.filter((e) => e.id !== employee.id);

    if (employee.groups) {
      employee.groups = employee.groups.filter((g) => g.id !== this.id);
    }

    return this.employees;
  }
}
