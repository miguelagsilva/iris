import { ChangePasswordUserDto, CreateEmployeeDto, CreateGroupDto, CreateOrganizationDto, CreateUserDto, PaginationDto, PaginationResult, RequestOTPEmployeeDto, SafeEmployeeDto, SafeGroupDto, SafeOrganizationDto, SafeUserDto, SignedInEmployeeDto, SignInEmployeeDto, SignInUserDto, SignUpUserDto, UpdateEmployeeDto, UpdateGroupDto, UpdateOrganizationDto, UpdateUserDto } from "@/types/api";
import { SignedInUserDto } from "@/types/auth";
import i18next from "i18next";

const API_URL = import.meta.env.VITE_API_URL;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "An error occurred");
  }
  return response.json();
};

// Function to get headers with language support
const getHeaders = async () => {
  await i18next.init();
  const language = i18next.language;
  return {
    "Content-Type": "application/json",
    "Accept-Language": language,
  };
};

// Generic function to make HTTP requests
const makeRequest = async <TData>(
  method: HttpMethod,
  url: string,
  data?: object
): Promise<TData> => {
  const headers = await getHeaders();
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (data) {
    if (method === 'GET') {
      const searchParams = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value);
        }
      });
      url += `?${searchParams.toString()}`;
    } else if (method === 'POST' || method === 'PUT') {
      options.body = JSON.stringify(data);
    }
  }

  const response = await fetch(`${API_URL}/${url}`, options);
  
  if (method === 'DELETE') {
    await handleResponse(response);
    return undefined as TData;
  }
  
  return handleResponse(response);
};

// Auth
export const signUpUser = (data: SignUpUserDto) => 
  makeRequest<void>('POST', 'api/v1/auth/user/sign-up', data);

export const signInUser = (data: SignInUserDto) => 
  makeRequest<void>('POST', 'api/v1/auth/user/sign-in', data);

export const signOutUser = () => 
  makeRequest<void>('POST', 'api/v1/auth/user/sign-out');

export const changePassword = (data: ChangePasswordUserDto) => 
  makeRequest<void>('POST', 'api/v1/auth/user/change-password', data);

export const getUserProfile = () => 
  makeRequest<SignedInUserDto>('GET', 'api/v1/auth/user/profile');

export const updateUserProfile = (data: UpdateUserDto) => 
  makeRequest<SafeUserDto>('PUT', 'api/v1/auth/user/profile', data);

export const requestEmployeeOTP = (data: RequestOTPEmployeeDto) => 
  makeRequest<void>('POST', 'api/v1/auth/employee/request-otp', data);

export const signInEmployee = (data: SignInEmployeeDto) => 
  makeRequest<void>('POST', 'api/v1/auth/employee/sign-in', data);

export const signOutEmployee = () => 
  makeRequest<void>('POST', 'api/v1/auth/employee/sign-out');

export const getEmployeeProfile = () => 
  makeRequest<SignedInEmployeeDto>('GET', 'api/v1/auth/employee/profile');

// Users
export const createUser = (data: CreateUserDto) => 
  makeRequest<SafeUserDto>('POST', 'api/v1/users', data);

export const getUsers = (query?: PaginationDto) => 
  makeRequest<PaginationResult<SafeUserDto>>('GET', 'api/v1/users', query);

export const getUserById = (id: string) => 
  makeRequest<SafeUserDto>('GET', `api/v1/users/${id}`);

export const updateUser = (id: string, data: UpdateUserDto) => 
  makeRequest<SafeUserDto>('PUT', `api/v1/users/${id}`, data);

export const partialUpdateUser = (id: string, data: UpdateUserDto) => 
  makeRequest<SafeUserDto>('PUT', `api/v1/users/${id}`, data);

export const deleteUser = (id: string) => 
  makeRequest<SafeUserDto>('DELETE', `api/v1/users/${id}`);

export const restoreUser = (id: string) => 
  makeRequest<SafeUserDto>('POST', `api/v1/users/${id}/restore`);

// Organizations
export const createOrganization = (data: CreateOrganizationDto) => 
  makeRequest<SafeOrganizationDto>('POST', 'api/v1/organizations', data);

export const getOrganizations = (query?: PaginationDto) => 
  makeRequest<PaginationResult<SafeOrganizationDto>>('GET', 'api/v1/organizations', query);

export const getOrganizationById = (id: string) => 
  makeRequest<SafeOrganizationDto>('GET', `api/v1/organizations/${id}`);

export const updateOrganization = (id: string, data: UpdateOrganizationDto) => 
  makeRequest<SafeOrganizationDto>('PUT', `api/v1/organizations/${id}`, data);

export const partialUpdateOrganization = (id: string, data: UpdateOrganizationDto) => 
  makeRequest<SafeOrganizationDto>('PUT', `api/v1/organizations/${id}`, data);

export const deleteOrganization = (id: string) => 
  makeRequest<SafeOrganizationDto>('DELETE', `api/v1/organizations/${id}`);

export const restoreOrganization = (id: string) => 
  makeRequest<SafeOrganizationDto>('POST', `api/v1/organizations/${id}/restore`);

export const addUserToOrganization = (organizationId: string, userId: string) => 
  makeRequest<SafeUserDto[]>('POST', `api/v1/organizations/${organizationId}/users/${userId}`);

export const removeUserFromOrganization = (organizationId: string, userId: string) => 
  makeRequest<SafeUserDto[]>('DELETE', `api/v1/organizations/${organizationId}/users/${userId}`);

export const getOrganizationUsers = (organizationId: string, query?: PaginationDto) => 
  makeRequest<PaginationResult<SafeUserDto>>('GET', `api/v1/organizations/${organizationId}/users`, query);

export const getOrganizationGroups = (organizationId: string, query?: PaginationDto) => 
  makeRequest<PaginationResult<SafeGroupDto>>('GET', `api/v1/organizations/${organizationId}/groups`, query);

export const getOrganizationEmployees = (organizationId: string, query?: PaginationDto) => 
  makeRequest<PaginationResult<SafeEmployeeDto>>('GET', `api/v1/organizations/${organizationId}/employees`, query);

// Groups
export const createGroup = (data: CreateGroupDto) => 
  makeRequest<SafeGroupDto>('POST', 'api/v1/groups', data);

export const getGroupById = (id: string) => 
  makeRequest<SafeGroupDto>('GET', `api/v1/groups/${id}`);

export const updateGroup = (id: string, data: UpdateGroupDto) => 
  makeRequest<SafeGroupDto>('PUT', `api/v1/groups/${id}`, data);

export const partialUpdateGroup = (id: string, data: UpdateGroupDto) => 
  makeRequest<SafeGroupDto>('PUT', `api/v1/groups/${id}`, data);

export const deleteGroup = (id: string) => 
  makeRequest<SafeGroupDto>('DELETE', `api/v1/groups/${id}`);

export const restoreGroup = (id: string) => 
  makeRequest<SafeGroupDto>('POST', `api/v1/groups/${id}/restore`);

export const getGroupEmployees = (id: string) => 
  makeRequest<SafeEmployeeDto[]>('GET', `api/v1/groups/${id}/employees`);

export const addEmployeeToGroup = (groupId: string, employeeId: string) => 
  makeRequest<SafeEmployeeDto[]>('POST', `api/v1/groups/${groupId}/employees/${employeeId}`);

export const removeEmployeeFromGroup = (groupId: string, employeeId: string) => 
  makeRequest<SafeGroupDto>('DELETE', `api/v1/groups/${groupId}/employees/${employeeId}`);

// Employees
export const createEmployee = (data: CreateEmployeeDto) => 
  makeRequest<SafeEmployeeDto>('POST', 'api/v1/employees', data);

export const getEmployeeById = (id: string) => 
  makeRequest<SafeEmployeeDto>('GET', `api/v1/employees/${id}`);

export const updateEmployee = (id: string, data: UpdateEmployeeDto) => 
  makeRequest<SafeEmployeeDto>('PUT', `api/v1/employees/${id}`, data);

export const partialUpdateEmployee = (id: string, data: UpdateEmployeeDto) => 
  makeRequest<SafeEmployeeDto>('PUT', `api/v1/employees/${id}`, data);

export const deleteEmployee = (id: string) => 
  makeRequest<SafeEmployeeDto>('DELETE', `api/v1/employees/${id}`);

export const restoreEmployee = (id: string) => 
  makeRequest<SafeEmployeeDto>('POST', `api/v1/employees/${id}/restore`);

export const getEmployeeGroups = (id: string) => 
  makeRequest<SafeGroupDto[]>('GET', `api/v1/employees/${id}/groups`);

export const addGroupToEmployee = (employeeId: string, groupId: string) => 
  makeRequest<SafeEmployeeDto>('POST', `api/v1/employees/${employeeId}/groups/${groupId}`);

export const removeGroupFromEmployee = (employeeId: string, groupId: string) => 
  makeRequest<SafeEmployeeDto>('DELETE', `api/v1/employees/${employeeId}/group/${groupId}`);
