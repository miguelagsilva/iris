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
import { User } from 'src/users/user.entity';
import { Employee } from 'src/employees/employee.entity';

@Entity()
@Unique(['name'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'\- !]+$/u, {
    message:
      'Name can only contain letters, accents, apostrophes, hyphens, spaces and exclamation points',
  })
  name: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Group, (group) => group.organization, {
    cascade: true,
  })
  groups: Group[];

  @OneToMany(() => Employee, (employee) => employee.organization, {
    cascade: true,
  })
  employees: Employee[];
}
