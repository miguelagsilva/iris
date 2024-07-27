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
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID, Matches, IsNotEmpty } from 'class-validator';
import { Organization } from '../organizations/organization.entity';
import { Employee } from '../employees/employee.entity';
import { SafeGroupDto } from './dto/safe-group.dto';
import { Exclude, plainToInstance } from 'class-transformer';

@Entity()
@Unique(['name'])
export class Group {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  name: string;

  @ApiProperty()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.groups, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @ManyToMany(() => Employee, (employee) => employee.groups)
  employees: Employee[];

  toSafeGroup(): SafeGroupDto {
    return plainToInstance(SafeGroupDto, this, {
      excludeExtraneousValues: true,
    });
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
    this.employees = this.employees.filter((e) => e != employee);
    return this.employees;
  }
}
