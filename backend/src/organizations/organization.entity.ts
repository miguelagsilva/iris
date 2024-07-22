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
  @Matches(/^[a-zA-Z0-9-]$/u, {
    message:
      'Name can only contain letters, numbers and hyphens',
  })
  code: string;

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
}
