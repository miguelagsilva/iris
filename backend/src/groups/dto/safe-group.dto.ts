import { Expose, Transform } from 'class-transformer';
import { IsString, IsUUID, IsNotEmpty, Length, Matches } from 'class-validator';

export class SafeGroupDto {
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  @Expose()
  name: string;

  @IsUUID()
  @Expose()
  @Transform(({ obj }) => obj.organization?.id)
  organizationId: string;
}
