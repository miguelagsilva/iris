import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString, Length, IsUUID, Matches, IsNotEmpty } from "class-validator";
import { Exclude } from "class-transformer";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
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
    message: 'Password must be at least 8 characters long and contain at least one number'
  })
  password: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens'
  })
  firstName: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens'
  })
  lastName: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
