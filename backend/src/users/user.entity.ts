import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Length,
  IsUUID,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Exclude, plainToClass } from 'class-transformer';
import { Organization } from '../organizations/organization.entity';
import { SafeUserDto } from './dto/safe-user.dto';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @ApiProperty()
  @Column()
  @Index()
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 48)
  email: string;

  @ApiProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @Length(8, 64)
  @Matches(/^(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one number',
  })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  firstName: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  lastName: string;

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

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization: Organization;

  toSafeUser(): SafeUserDto {
    return plainToClass(SafeUserDto, this, { excludeExtraneousValues: true });
  }
}
