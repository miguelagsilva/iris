import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  @Matches(/^[a-zA-Z0-9-]*$/u, {
    message: 'Code can only contain letters, numbers and hyphens',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}0-9'\- !,&-]+$/u, {
    message:
      'Name can only contain letters, accents, apostrophes, commas, hyphens, space, exclamation points and &',
  })
  name: string;
}
