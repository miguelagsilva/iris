import { Expose, Transform } from 'class-transformer';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class SafeAssistantDto {
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsUUID()
  @Expose()
  @Transform(({ obj }) => obj.group?.id)
  groupId: string;
}
