import { IsString, Length, Matches, IsOptional, IsUUID } from 'class-validator';

export class UpdateGroupDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  @IsOptional()
  name?: string;

  @IsUUID(undefined, { each: true })
  @IsOptional()
  employeesIds?: string[];
}
