/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SignUpUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInUserDto {
  email: string;
  password: string;
}

export interface ChangePasswordUserDto {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface SafeUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
}

export interface UpdateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface PaginationResult {
  items: any[][];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CreateOrganizationDto {
  code: string;
  name: string;
}

export interface SafeOrganizationDto {
  code: string;
  name: string;
}

export interface UpdateOrganizationDto {
  code: string;
  name: string;
}

export interface SafeGroupDto {
  id: string;
  name: string;
  organizationId: string;
}

export interface SafeEmployeeDto {
  id: string;
  name: string;
  phone_number: string;
  organizationId: string;
}

export interface CreateGroupDto {
  name: string;
  organizationId: string;
}

export interface UpdateGroupDto {
  name: string;
}

export interface CreateEmployeeDto {
  name: string;
  organizationId: string;
  phone_number: string;
}

export interface UpdateEmployeeDto {
  name: string;
  phone_number: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title OpenAPI
 * @version 1.0
 * @contact
 *
 *
 *       # Authentication and Permissions
 *
 *       This API uses the following authentication and permission levels:
 *
 *       - **Public**: No authentication required
 *       - **User**
 *       - **Admin**
 *       - **Organization Member**
 *
 *       Each endpoint in this documentation specifies its required permission level in the description.
 *
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerSignUpUser
     * @summary Sign up as a user
     * @request POST:/api/v1/auth/user/sign-up
     */
    authControllerSignUpUser: (
      data: SignUpUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/auth/user/sign-up`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerSignInUser
     * @summary Sign in as a user
     * @request POST:/api/v1/auth/user/sign-in
     */
    authControllerSignInUser: (
      data: SignInUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/auth/user/sign-in`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerSignOutUser
     * @summary Sign out as a user
     * @request POST:/api/v1/auth/user/sign-out
     * @secure
     */
    authControllerSignOutUser: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/auth/user/sign-out`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerChangePassword
     * @summary Change password as a user
     * @request POST:/api/v1/auth/user/change-password
     * @secure
     */
    authControllerChangePassword: (
      data: ChangePasswordUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/auth/user/change-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerGetProfileUser
     * @summary Get own user profile
     * @request GET:/api/v1/auth/user/profile
     * @secure
     */
    authControllerGetProfileUser: (params: RequestParams = {}) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/auth/user/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerUpdateProfileUser
     * @summary Get own user profile
     * @request PATCH:/api/v1/auth/user/profile
     * @secure
     */
    authControllerUpdateProfileUser: (
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/auth/user/profile`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users, Admin
     * @name UsersControllerCreate
     * @summary Create a new user
     * @request POST:/api/v1/users
     */
    usersControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users, Admin
     * @name UsersControllerPaginate
     * @summary Get all users
     * @request GET:/api/v1/users
     */
    usersControllerPaginate: (
      query?: {
        /**
         * Page number
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * Number of items per page
         * @min 1
         * @max 50
         * @default 10
         */
        limit?: number;
        /** Filter criteria */
        filter?: object;
        /** Field to sort by */
        sortBy?: string;
        /** Sort order */
        sortOrder?: "ASC" | "DESC";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationResult, void>({
        path: `/api/v1/users`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users, Admin
     * @name UsersControllerFindOne
     * @summary Get a user by ID
     * @request GET:/api/v1/users/{id}
     */
    usersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/users/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users, Admin
     * @name UsersControllerUpdate
     * @summary Update a user
     * @request PUT:/api/v1/users/{id}
     */
    usersControllerUpdate: (
      id: string,
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/users/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users, Admin
     * @name UsersControllerPartialUpdate
     * @summary Partially update a user
     * @request PATCH:/api/v1/users/{id}
     */
    usersControllerPartialUpdate: (
      id: string,
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/users/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users, Admin
     * @name UsersControllerRemove
     * @summary Soft delete a user
     * @request DELETE:/api/v1/users/{id}
     */
    usersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/users/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users, Admin
     * @name UsersControllerRestore
     * @summary Restore a soft-deleted user
     * @request POST:/api/v1/users/{id}/restore
     */
    usersControllerRestore: (id: string, params: RequestParams = {}) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/users/${id}/restore`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Admin
     * @name OrganizationsControllerCreate
     * @summary Create a new organization
     * @request POST:/api/v1/organizations
     */
    organizationsControllerCreate: (
      data: CreateOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeOrganizationDto, void>({
        path: `/api/v1/organizations`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Admin
     * @name OrganizationsControllerGetPaginated
     * @summary Get all organizations
     * @request GET:/api/v1/organizations
     */
    organizationsControllerGetPaginated: (
      query?: {
        /**
         * Page number
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * Number of items per page
         * @min 1
         * @max 50
         * @default 10
         */
        limit?: number;
        /** Filter criteria */
        filter?: object;
        /** Field to sort by */
        sortBy?: string;
        /** Sort order */
        sortOrder?: "ASC" | "DESC";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationResult, void>({
        path: `/api/v1/organizations`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Organization
     * @name OrganizationsControllerFindOne
     * @summary Get an organization by ID
     * @request GET:/api/v1/organizations/{id}
     */
    organizationsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<SafeOrganizationDto, void>({
        path: `/api/v1/organizations/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Admin
     * @name OrganizationsControllerUpdate
     * @summary Update an organization
     * @request PUT:/api/v1/organizations/{id}
     */
    organizationsControllerUpdate: (
      id: string,
      data: UpdateOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeOrganizationDto, void>({
        path: `/api/v1/organizations/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Admin
     * @name OrganizationsControllerPartialUpdate
     * @summary Partially update an organization
     * @request PATCH:/api/v1/organizations/{id}
     */
    organizationsControllerPartialUpdate: (
      id: string,
      data: UpdateOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeOrganizationDto, void>({
        path: `/api/v1/organizations/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Admin
     * @name OrganizationsControllerRemove
     * @summary Soft delete an organization
     * @request DELETE:/api/v1/organizations/{id}
     */
    organizationsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<SafeOrganizationDto, void>({
        path: `/api/v1/organizations/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Admin
     * @name OrganizationsControllerRestore
     * @summary Restore a soft-deleted organization
     * @request POST:/api/v1/organizations/{id}/restore
     */
    organizationsControllerRestore: (id: string, params: RequestParams = {}) =>
      this.request<SafeOrganizationDto, void>({
        path: `/api/v1/organizations/${id}/restore`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Organization
     * @name OrganizationsControllerAddUserToOrganization
     * @summary Add a user to an organization
     * @request POST:/api/v1/organizations/{id}/users/{userId}
     */
    organizationsControllerAddUserToOrganization: (
      id: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.request<SafeUserDto[], void>({
        path: `/api/v1/organizations/${id}/users/${userId}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Organization
     * @name OrganizationsControllerRemoveUserFromOrganization
     * @summary Remove user from an organization
     * @request DELETE:/api/v1/organizations/{id}/users/{userId}
     */
    organizationsControllerRemoveUserFromOrganization: (
      id: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.request<SafeUserDto[], void>({
        path: `/api/v1/organizations/${id}/users/${userId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Organization
     * @name OrganizationsControllerGetPaginatedUsers
     * @summary Get all users
     * @request GET:/api/v1/organizations/{id}/users
     */
    organizationsControllerGetPaginatedUsers: (
      id: string,
      query?: {
        /**
         * Page number
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * Number of items per page
         * @min 1
         * @max 50
         * @default 10
         */
        limit?: number;
        /** Filter criteria */
        filter?: object;
        /** Field to sort by */
        sortBy?: string;
        /** Sort order */
        sortOrder?: "ASC" | "DESC";
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationResult, void>({
        path: `/api/v1/organizations/${id}/users`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Organization
     * @name OrganizationsControllerGetOrganizationGroups
     * @summary Get all groups of an organization
     * @request GET:/api/v1/organizations/{id}/groups
     */
    organizationsControllerGetOrganizationGroups: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<SafeGroupDto[], void>({
        path: `/api/v1/organizations/${id}/groups`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags organizations, Organization
     * @name OrganizationsControllerGetOrganizationEmployees
     * @summary Get all employees of an organization
     * @request GET:/api/v1/organizations/{id}/employees
     */
    organizationsControllerGetOrganizationEmployees: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<SafeEmployeeDto[], void>({
        path: `/api/v1/organizations/${id}/employees`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups, Organization
     * @name GroupsControllerCreate
     * @summary Create a new group
     * @request POST:/api/v1/groups
     */
    groupsControllerCreate: (
      data: CreateGroupDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeGroupDto, void>({
        path: `/api/v1/groups`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups, Organization
     * @name GroupsControllerFindOne
     * @summary Get a group by ID
     * @request GET:/api/v1/groups/{id}
     */
    groupsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<SafeGroupDto, void>({
        path: `/api/v1/groups/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups, Organization
     * @name GroupsControllerUpdate
     * @summary Update a group
     * @request PUT:/api/v1/groups/{id}
     */
    groupsControllerUpdate: (
      id: string,
      data: UpdateGroupDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeGroupDto, void>({
        path: `/api/v1/groups/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups, Organization
     * @name GroupsControllerPartialUpdate
     * @summary Partially update a group
     * @request PATCH:/api/v1/groups/{id}
     */
    groupsControllerPartialUpdate: (
      id: string,
      data: UpdateGroupDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeGroupDto, void>({
        path: `/api/v1/groups/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups, Organization
     * @name GroupsControllerRemove
     * @summary Soft delete a group
     * @request DELETE:/api/v1/groups/{id}
     */
    groupsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<SafeGroupDto, void>({
        path: `/api/v1/groups/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups, Organization
     * @name GroupsControllerRestore
     * @summary Restore a soft-deleted group
     * @request POST:/api/v1/groups/{id}/restore
     */
    groupsControllerRestore: (id: string, params: RequestParams = {}) =>
      this.request<SafeGroupDto, void>({
        path: `/api/v1/groups/${id}/restore`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups, Organization
     * @name GroupsControllerGetEmployees
     * @summary Get all employees of a group by ID
     * @request GET:/api/v1/groups/{id}/employees
     */
    groupsControllerGetEmployees: (id: string, params: RequestParams = {}) =>
      this.request<SafeEmployeeDto[], void>({
        path: `/api/v1/groups/${id}/employees`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups, Organization
     * @name GroupsControllerAddEmployeeToGroup
     * @summary Add employee to a group
     * @request POST:/api/v1/groups/{id}/employees/{employeeId}
     */
    groupsControllerAddEmployeeToGroup: (
      id: string,
      employeeId: string,
      params: RequestParams = {},
    ) =>
      this.request<SafeEmployeeDto[], void>({
        path: `/api/v1/groups/${id}/employees/${employeeId}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups, Organization
     * @name GroupsControllerRemoveEmployeeFromGroup
     * @summary Remove employee from a group
     * @request DELETE:/api/v1/groups/{id}/employees/{employeeId}
     */
    groupsControllerRemoveEmployeeFromGroup: (
      id: string,
      employeeId: string,
      params: RequestParams = {},
    ) =>
      this.request<SafeGroupDto, void>({
        path: `/api/v1/groups/${id}/employees/${employeeId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags employees, Organization
     * @name EmployeesControllerCreate
     * @summary Create a new employee
     * @request POST:/api/v1/employees
     */
    employeesControllerCreate: (
      data: CreateEmployeeDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeEmployeeDto, void>({
        path: `/api/v1/employees`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags employees, Organization
     * @name EmployeesControllerFindOne
     * @summary Get a employee by ID
     * @request GET:/api/v1/employees/{id}
     */
    employeesControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<SafeEmployeeDto, void>({
        path: `/api/v1/employees/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags employees, Organization
     * @name EmployeesControllerUpdate
     * @summary Update a employee
     * @request PUT:/api/v1/employees/{id}
     */
    employeesControllerUpdate: (
      id: string,
      data: UpdateEmployeeDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeEmployeeDto, void>({
        path: `/api/v1/employees/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags employees, Organization
     * @name EmployeesControllerPartialUpdate
     * @summary Partially update a employee
     * @request PATCH:/api/v1/employees/{id}
     */
    employeesControllerPartialUpdate: (
      id: string,
      data: UpdateEmployeeDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeEmployeeDto, void>({
        path: `/api/v1/employees/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags employees, Organization
     * @name EmployeesControllerRemove
     * @summary Soft delete a employee
     * @request DELETE:/api/v1/employees/{id}
     */
    employeesControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<SafeEmployeeDto, void>({
        path: `/api/v1/employees/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags employees, Organization
     * @name EmployeesControllerRestore
     * @summary Restore a soft-deleted employee
     * @request POST:/api/v1/employees/{id}/restore
     */
    employeesControllerRestore: (id: string, params: RequestParams = {}) =>
      this.request<SafeEmployeeDto, void>({
        path: `/api/v1/employees/${id}/restore`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags employees, Organization
     * @name EmployeesControllerGetGroups
     * @summary Get all groups of an employee by ID
     * @request GET:/api/v1/employees/{id}/groups
     */
    employeesControllerGetGroups: (id: string, params: RequestParams = {}) =>
      this.request<SafeGroupDto[], void>({
        path: `/api/v1/employees/${id}/groups`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags employees, Organization
     * @name EmployeesControllerAddGroupToEmployee
     * @summary Add group to an employee
     * @request POST:/api/v1/employees/{id}/groups/{groupId}
     */
    employeesControllerAddGroupToEmployee: (
      id: string,
      groupId: string,
      params: RequestParams = {},
    ) =>
      this.request<SafeEmployeeDto, void>({
        path: `/api/v1/employees/${id}/groups/${groupId}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags employees, Organization
     * @name EmployeesControllerRemoveGroupFromEmployee
     * @summary Remove group from an employee
     * @request DELETE:/api/v1/employees/{id}/group/{groupId}
     */
    employeesControllerRemoveGroupFromEmployee: (
      id: string,
      groupId: string,
      params: RequestParams = {},
    ) =>
      this.request<SafeEmployeeDto, void>({
        path: `/api/v1/employees/${id}/group/${groupId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
}
