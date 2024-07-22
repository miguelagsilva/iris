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
  @Matches(/^[a-zA-Z0-9-]$/u, {
    message: 'Name can only contain letters, numbers and hyphens',
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
}
