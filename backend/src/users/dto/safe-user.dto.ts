import { OmitType } from "@nestjs/swagger";
import { User } from "../user.entity";

export class SafeUserDto extends OmitType(User, ['id', 'createdAt', 'updatedAt', 'password'] as const) {}
