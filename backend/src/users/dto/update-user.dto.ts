import { OmitType, PartialType } from "@nestjs/swagger";
import { User } from "../user.entity";

export class UpdateUserDto extends PartialType(
  OmitType(User, ['id', 'password', 'createdAt', 'updatedAt', 'role'] as const)
) {}

