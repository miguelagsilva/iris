import {
  IsString,
  Length,
  Matches,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateGroupDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  @IsOptional()
  name?: string;
}
