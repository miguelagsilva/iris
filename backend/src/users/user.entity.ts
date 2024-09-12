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
import {
  IsEmail,
  IsString,
  Length,
  IsUUID,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Exclude, plainToInstance } from 'class-transformer';
import { Organization } from '../organizations/organization.entity';
import { SafeUserDto } from './dto/safe-user.dto';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @Index()
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 48)
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @Length(8, 64)
  @Matches(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/, {
    message:
      'Password must be at least 8 characters long and contain at least one number',
  })
  @Exclude()
  password: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  firstName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  lastName: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization: Organization;

  toSafeUser(): SafeUserDto {
    const safeUser = plainToInstance(SafeUserDto, this, {
      excludeExtraneousValues: true,
    });
    safeUser.organizationId = this.organization?.id ? this.organization.id : '';
    return safeUser;
  }
}
