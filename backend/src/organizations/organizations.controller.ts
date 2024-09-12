import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { SafeOrganizationDto } from './dto/safe-organization.dto';
import { SafeUserDto } from '../users/dto/safe-user.dto';
import { SafeGroupDto } from '../groups/dto/safe-group.dto';
import { SafeEmployeeDto } from '../employees/dto/safe-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';
import { Organization } from './organization.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ILike } from 'typeorm';
import { Group } from '../groups/group.entity';
import { GroupsService } from '../groups/groups.service';
import { EmployeesService } from '../employees/employees.service';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => GroupsService))
    private groupsService: GroupsService,
    @Inject(forwardRef(() => EmployeesService))
    private employeesService: EmployeesService,
  ) {}

  @Post()
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    type: SafeOrganizationDto,
  })
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<SafeOrganizationDto> {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all organizations successfully',
    type: PaginationResult<SafeOrganizationDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: 'object',
    description: 'Filter criteria',
  })
  getPaginated(
    @Query() paginationDto: PaginationDto<Organization>,
  ): Promise<PaginationResult<SafeOrganizationDto>> {
    return this.organizationsService.paginate(paginationDto);
  }

  @Get(':id')
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved organization successfully',
    type: SafeOrganizationDto,
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeOrganizationDto> {
    return this.organizationsService.findOne(id);
  }

  @Put(':id')
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: SafeOrganizationDto,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<SafeOrganizationDto> {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Patch(':id')
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Partially update an organization' })
  @ApiResponse({
    status: 200,
    description: 'Organization partially updated successfully',
    type: SafeOrganizationDto,
  })
  partialUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<SafeOrganizationDto> {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Soft delete an organization' })
  @ApiResponse({
    status: 200,
    description: 'Organization soft deleted successfully',
    type: SafeOrganizationDto,
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<SafeOrganizationDto> {
    return this.organizationsService.remove(id);
  }

  @Post(':id/restore')
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Restore a soft-deleted organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization restored successfully',
    type: SafeOrganizationDto,
  })
  restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeOrganizationDto> {
    return this.organizationsService.restore(id);
  }

  @Post(':id/users/:userId')
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Add a user to an organization' })
  @ApiResponse({
    status: 201,
    description: 'Added user to organization successfully',
    type: [SafeUserDto],
  })
  addUserToOrganization(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<SafeUserDto[]> {
    return this.organizationsService.addUserToOrganization(id, userId);
  }

  @Delete(':id/users/:userId')
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Remove user from an organization' })
  @ApiResponse({
    status: 200,
    description: 'Removed user from organization successfully',
    type: [SafeUserDto],
  })
  removeUserFromOrganization(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<SafeUserDto[]> {
    return this.organizationsService.removeUserFromOrganization(id, userId);
  }

  @Get(':id/users')
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved organization users successfully',
    type: PaginationResult<SafeUserDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'filterBy',
    required: false,
    type: String,
    description: 'Field to filter by',
  })
  @ApiQuery({
    name: 'filterValue',
    required: false,
    type: String,
    description: 'Value to filter by',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  async getPaginatedUsers(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto<User>,
  ): Promise<PaginationResult<SafeUserDto>> {
    console.log("paginationDto", paginationDto);
    const filter: Record<string, any> = {
      organization: { id: id },
    };
    if (paginationDto.filterBy && paginationDto.filterBy != 'organization' && paginationDto.filterValue) {
      filter[paginationDto.filterBy] = ILike(`%${paginationDto.filterValue.toLowerCase()}%`);
    }
    paginationDto.filter = filter;
    return await this.usersService.paginate(paginationDto);
  }

  @Get(':id/groups')
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved organization groups successfully',
    type: PaginationResult<SafeGroupDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'filterBy',
    required: false,
    type: String,
    description: 'Field to filter by',
  })
  @ApiQuery({
    name: 'filterValue',
    required: false,
    type: String,
    description: 'Value to filter by',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  async getPaginatedGroups(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto<Group>,
  ): Promise<PaginationResult<SafeGroupDto>> {
    console.log("paginationDto", paginationDto);
    const filter: Record<string, any> = {
      organization: { id: id },
    };
    if (paginationDto.filterBy && paginationDto.filterBy != 'organization' && paginationDto.filterValue) {
      filter[paginationDto.filterBy] = ILike(`%${paginationDto.filterValue.toLowerCase()}%`);
    }
    paginationDto.filter = filter;
    return await this.groupsService.paginate(paginationDto);
  }

  @Get(':id/employees')
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved organization employees successfully',
    type: PaginationResult<SafeEmployeeDto>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'filterBy',
    required: false,
    type: String,
    description: 'Field to filter by',
  })
  @ApiQuery({
    name: 'filterValue',
    required: false,
    type: String,
    description: 'Value to filter by',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  async getPaginatedEmployees(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto<Group>,
  ): Promise<PaginationResult<SafeGroupDto>> {
    console.log("paginationDto", paginationDto);
    const filter: Record<string, any> = {
      organization: { id: id },
    };
    if (paginationDto.filterBy && paginationDto.filterBy != 'organization' && paginationDto.filterValue) {
      filter[paginationDto.filterBy] = ILike(`%${paginationDto.filterValue.toLowerCase()}%`);
    }
    paginationDto.filter = filter;
    return await this.employeesService.paginate(paginationDto);
  }
}
