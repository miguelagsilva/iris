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
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID, Matches, IsNotEmpty, IsPhoneNumber, IsNumber, IsDate, IsOptional, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer'
import { Organization } from '../organizations/organization.entity';
import { Group } from 'src/groups/group.entity';

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
  otp: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsDate()
  otp_expires: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.employees, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @ManyToMany(() => Group, { cascade: true })
  @JoinTable()
  groups: Group[];
}
