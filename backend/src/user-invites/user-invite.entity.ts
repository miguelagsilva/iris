import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  IsEmail,
  Length,
  IsUUID,
  IsNotEmpty,
  Max,
  IsDate,
} from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class UserInvite {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @Column()
  @Index()
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 48)
  email: string;

  @Column()
  @IsDate()
  @IsNotEmpty()
  expiredAt: Date;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}
