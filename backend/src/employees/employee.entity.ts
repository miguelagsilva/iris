import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinTable,
  Column,
  Unique,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsUUID,
  Matches,
  IsNotEmpty,
  IsPhoneNumber,
  IsDate,
  IsNumberString,
  IsNumber,
} from 'class-validator';
import { Exclude, plainToClass } from 'class-transformer';
import { Organization } from '../organizations/organization.entity';
import { Group } from '../groups/group.entity';
import { SafeEmployeeDto } from './dto/safe-employee.dto';

@Entity()
@Unique(['phone_number'])
export class Employee {
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

  @Column()
  @IsNotEmpty()
  @IsPhoneNumber('PT')
  phone_number: string;

  @Column({ nullable: true })
  @IsNumberString()
  @Exclude()
  otp: string;

  @Column({ nullable: true })
  @IsDate()
  @Exclude()
  otp_expires_at: Date;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.employees, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @ManyToMany(() => Group, (group) => group.employees, { cascade: true })
  @JoinTable()
  groups: Group[];

  toSafeEmployee(): SafeEmployeeDto {
    return plainToClass(SafeEmployeeDto, this, {
      excludeExtraneousValues: true,
    });
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
      group.organization.id == this.organization.id
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
}
