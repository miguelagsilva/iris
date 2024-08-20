import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID, Matches, IsNotEmpty } from 'class-validator';
import { Group } from '../groups/group.entity';
import { User } from '../users/user.entity';
import { Employee } from '../employees/employee.entity';
import { SafeOrganizationDto } from './dto/safe-organization.dto';
import { Exclude, plainToClass } from 'class-transformer';

@Entity()
@Unique(['name', 'code'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  @Matches(/^[a-zA-Z0-9-]*$/u, {
    message: 'Code can only contain letters, numbers and hyphens',
  })
  code: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}0-9'\- !,&-]+$/u, {
    message:
      'Name can only contain letters, accents, apostrophes, commas, hyphens, space, exclamation points and &',
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

  @OneToMany(() => User, (user) => user.organization, {
    cascade: true,
  })
  users: User[];

  @OneToMany(() => Group, (group) => group.organization, {
    cascade: true,
  })
  groups: Group[];

  @OneToMany(() => Employee, (employee) => employee.organization, {
    cascade: true,
  })
  employees: Employee[];

  toSafeOrganization(): SafeOrganizationDto {
    return plainToClass(SafeOrganizationDto, this, {
      excludeExtraneousValues: true,
    });
  }

  getUsers(): User[] {
    return this.users || [];
  }

  addUser(user: User): User[] {
    if (!this.users) {
      this.users = [];
    }
    if (!this.users.some((u) => u.id == user.id)) {
      this.users.push(user);
      user.organization = this;
    }
    return this.users;
  }

  removeUser(user: User): User[] {
    if (!this.users) {
      return [];
    }
    if (user.organization && user.organization.id == this.id) {
      this.users = this.users.filter((u) => u != user);
      user.organization = null;
    }
    return this.users;
  }

  getGroups(): Group[] {
    return this.groups || [];
  }

  addGroup(group: Group): Group[] {
    if (!this.groups) {
      this.groups = [];
    }
    if (
      !this.groups.some((g) => g.id == group.id) &&
      group.organization.id == this.id
    ) {
      this.groups.push(group);
    }
    return this.groups;
  }

  removeGroup(group: Group): Group[] {
    if (!this.groups) {
      return [];
    }
    this.groups = this.groups.filter((g) => g != group);
    return this.groups;
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
      employee.organization.id == this.id
    ) {
      this.employees.push(employee);
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
