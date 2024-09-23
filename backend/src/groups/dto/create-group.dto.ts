import { Type } from 'class-transformer';
import { IsString, Length, IsUUID, Matches, IsNotEmpty } from 'class-validator';
import { SafeEmployeeDto } from 'src/employees/dto/safe-employee.dto';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  name: string;

  @IsUUID(undefined, { each: true })
  employeesIds: string[];

  @IsUUID()
  @IsNotEmpty()
  organizationId: string;
}
