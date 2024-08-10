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

export interface UpdateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "include",
    headers: {},
    redirect: "follow",
    referrerPolicy: "strict-origin-when-cross-origin",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
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
     * @request POST:/api/v1/auth/user/profile
     * @secure
     */
    authControllerGetProfileUser: (params: RequestParams = {}) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/auth/user/profile`,
        method: "POST",
        secure: true,
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
         * @default 20
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
     * @tags users, User
     * @name UsersControllerGetCurrentUser
     * @summary Get own profile
     * @request GET:/api/v1/users/me
     */
    usersControllerGetCurrentUser: (params: RequestParams = {}) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/users/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users, User
     * @name UsersControllerUpdateCurrentUser
     * @summary Partially update own profile
     * @request PATCH:/api/v1/users/me
     */
    usersControllerUpdateCurrentUser: (
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<SafeUserDto, void>({
        path: `/api/v1/users/me`,
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
     * @name OrganizationsControllerPaginate
     * @summary Get all organizations
     * @request GET:/api/v1/organizations
     */
    organizationsControllerPaginate: (
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
         * @default 20
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
     * @name OrganizationsControllerGetOrganizationUsers
     * @summary Get all users in an organization
     * @request GET:/api/v1/organizations/{id}/users
     */
    organizationsControllerGetOrganizationUsers: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<SafeUserDto[], void>({
        path: `/api/v1/organizations/${id}/users`,
        method: "GET",
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
