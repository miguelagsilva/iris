import { IsEmail, Length, IsNotEmpty, Max, IsUUID } from 'class-validator';

export class CreateUserInviteDto {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(5, 48)
  email: string;

  @IsNotEmpty()
  @Max(1000 * 60 * 60 * 72)
  expirationTime: number;
}
