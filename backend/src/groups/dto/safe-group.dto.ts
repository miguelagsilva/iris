import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsUUID, IsNotEmpty, Length, Matches } from 'class-validator';

export class SafeGroupDto {
  @ApiProperty()
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  @Expose()
  name: string;

  @ApiProperty()
  @IsUUID()
  @Expose()
  organizationId: string;
}
