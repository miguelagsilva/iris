import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
  IsUUID,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '../../roles/roles.enum';
import { Expose } from 'class-transformer';

export class SafeUserDto {
  @ApiProperty()
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 48)
  @Expose()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  @Expose()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  @Expose()
  lastName: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  @IsEnum(Role)
  @Expose()
  role: Role;

  @ApiProperty()
  @Expose()
  organizationId: string;
}
