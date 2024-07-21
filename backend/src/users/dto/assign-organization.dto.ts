import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignOrganizationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;
}
