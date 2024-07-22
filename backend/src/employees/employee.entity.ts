import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinTable,
  Column,
  Timestamp,
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
} from 'class-validator';
import { Exclude, plainToClass } from 'class-transformer';
import { Organization } from '../organizations/organization.entity';
import { Group } from '../groups/group.entity';
import { SafeEmployeeDto } from './dto/safe-employee.dto';

@Entity()
export class Employee {
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
  @Column()
  @IsNotEmpty()
  @IsPhoneNumber('PT')
  phone_number: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsNumberString()
  @Exclude()
  otp: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsDate()
  @Exclude()
  otp_expires: Date;

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
}
