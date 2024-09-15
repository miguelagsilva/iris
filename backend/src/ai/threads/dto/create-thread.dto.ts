import { Expose } from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateThreadDto {
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  assistantId: string;
}
