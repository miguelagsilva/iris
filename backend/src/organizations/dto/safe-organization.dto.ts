import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID, Matches, IsNotEmpty } from 'class-validator';

export class SafeOrganizationDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  @Matches(/^[a-zA-Z0-9-]$/u, {
    message: 'Code can only contain letters, numbers and hyphens',
  })
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'\- !]+$/u, {
    message:
      'Name can only contain letters, accents, apostrophes, hyphens, spaces and exclamation points',
  })
  name: string;
}
