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
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { SafeOrganizationDto } from './dto/safe-organization.dto';
import { Role } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { SafeUserDto } from '../users/dto/safe-user.dto';
import { RequireOrganizationManager } from '../auth/auth.decorators';
import { SafeGroupDto } from '../groups/dto/safe-group.dto';
import { SafeEmployeeDto } from '../employees/dto/safe-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';
import { Organization } from './organization.entity';

@ApiBearerAuth('bearer')
@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  paginate(
    @Query() paginationDto: PaginationDto<Organization>,
  ): Promise<PaginationResult<SafeOrganizationDto>> {
    return this.organizationsService.paginate(paginationDto);
  }

  @Get(':id')
  @RequireOrganizationManager()
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @RequireOrganizationManager()
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
  @RequireOrganizationManager()
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
  @RequireOrganizationManager()
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Get all users in an organization' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved organization users successfully',
    type: [SafeUserDto],
  })
  getOrganizationUsers(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeUserDto[]> {
    return this.organizationsService.getOrganizationUsers(id);
  }

  @Get(':id/groups')
  @RequireOrganizationManager()
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Get all groups of an organization' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved organization groups successfully',
    type: [SafeGroupDto],
  })
  getOrganizationGroups(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeGroupDto[]> {
    return this.organizationsService.getOrganizationGroups(id);
  }

  @Get(':id/employees')
  @RequireOrganizationManager()
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Get all employees of an organization' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved organization employees successfully',
    type: [SafeEmployeeDto],
  })
  getOrganizationEmployees(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeEmployeeDto[]> {
    return this.organizationsService.getOrganizationEmployees(id);
  }
}
