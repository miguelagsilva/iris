import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsUUID, Matches, IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;
}
