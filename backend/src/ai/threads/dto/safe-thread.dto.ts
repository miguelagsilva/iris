import { Expose, Transform } from 'class-transformer';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class SafeThreadDto {
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsUUID()
  @Expose()
  @Transform(({ obj }) => obj.assistant?.id)
  assistantId: string;
}
