import { z } from "zod";

// User

export type ChangePasswordUserDto = {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export type SafeUserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
}

export type SignUpUserDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type RequestOTPEmployeeDto = {
  phone_number: string;
}

export type SignInUserDto = {
  email: string;
  password: string;
}

export type UpdateUserDto = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export type CreateUserDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type InviteUserDto = {
  email: string;
  organizationId: string;
} 

// Organization

export type CreateOrganizationDto = {
  code: string;
  name: string;
}

export type SafeOrganizationDto = {
  id: string;
  code: string;
  name: string;
}

export type UpdateOrganizationDto = {
  code?: string;
  name?: string;
}

// Group

export type SafeGroupDto = {
  id: string;
  name: string;
  employees: SafeEmployeeDto[];
  organizationId: string;
}

export type UpdateGroupDto = {
  name?: string;
  employeesIds?: string[];
}

export type CreateGroupDto = {
  name: string;
  organizationId: string;
  employeesIds: string[];
}


// Employee

export type SafeEmployeeDto = {
  id: string;
  name: string;
  organizationId: string;
  phone_number: string;
}

export type SignedInEmployeeDto = {
  id: string;
  name: string;
  phone_number: string;
  organization: SafeOrganizationDto;
}

export type SignInEmployeeDto = {
  phone_number: string;
  otp: string;
}

export type UpdateEmployeeDto = {
  name?: string;
  phone_number?: string;
  groupsIds?: string[];
}

export type CreateEmployeeDto = {
  name: string;
  phone_number: string;
  organizationId: string;
  groupsIds: string[];
}

// Pagination

export type PaginationResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type PaginationDto = {
  page?: number;
  limit?: number;
  filter?: object;
  filterBy?: string;
  filterValue?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Schemas

export const InviteUserSchema = z.object({
  email: z.string().email(),
  organizationId: z.string().uuid('Invalid organization ID'),
});

export const SignInUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .regex(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/, 'Password must contain at least one number')
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must not exceed 64 characters'),
});

export const RequestOTPEmployeeSchema = z.object({
  phone_number: z.string()
    .regex(/^(\+351)?9[1236]\d{7}$/, 'Please enter a valid Portuguese phone number'),
});

export const SignInEmployeeSchema = z.object({
  phone_number: z.string()
    .regex(/^(\+351)?9[1236]\d{7}$/, 'Please enter a valid Portuguese phone number'),
  otp: z.string()
    .regex(/^\d+$/, 'OTP must be a number')
    .length(6, 'OTP must be 6 characters long'),
});

export const CreateEmployeeSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
      message: 'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
    }),
  phone_number: z.string()
    .regex(/^9\d{8}$/, 'Please enter a valid Portuguese phone number'),
  organizationId: z.string().uuid('Invalid organization ID'),
  groupsIds: z.array(z.string().uuid('Invalid employee ID')),
});

export const UpdateEmployeeSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
      message: 'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
    })
    .optional(),
  phone_number: z.string()
    .regex(/^9\d{8}$/, 'Please enter a valid Portuguese phone number')
    .optional(),
  organizationId: z.string()
    .uuid('Invalid organization ID')
    .optional(),
  groupsIds: z.array(z.string().uuid('Invalid employee ID')).optional(),
});

export const CreateGroupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
      message: 'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
    }),
  organizationId: z.string().uuid('Invalid organization ID'),
  employeesIds: z.array(z.string().uuid('Invalid employee ID')),
});

export const UpdateGroupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
      message: 'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
    })
    .optional(),
  organizationId: z.string()
    .uuid('Invalid organization ID')
    .optional(),
  employeesIds: z.array(z.string().uuid('Invalid employee ID')).optional(),
});
