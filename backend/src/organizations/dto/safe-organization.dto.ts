import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Length, IsUUID, Matches, IsNotEmpty } from 'class-validator';

export class SafeOrganizationDto {
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  @Matches(/^[a-zA-Z0-9-]*$/u, {
    message: 'Code can only contain letters, numbers and hyphens',
  })
  @Expose()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}0-9'\- !,&-]+$/u, {
    message:
      'Name can only contain letters, accents, apostrophes, commas, hyphens, space, exclamation points and &',
  })
  @Expose()
  name: string;
}
