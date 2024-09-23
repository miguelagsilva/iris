import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAssistantDto {
  @IsNotEmpty()
  @IsUUID()
  groupId: string;
}
