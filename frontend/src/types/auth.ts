import { SafeOrganizationDto } from "./api";

export type SignedInUserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: SafeOrganizationDto;
}
