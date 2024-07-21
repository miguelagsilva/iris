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
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { SafeGroupDto } from './dto/safe-group.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { RequireOrganizationManager } from 'src/auth/auth.decorators';
import { SafeEmployeeDto } from 'src/employees/dto/safe-employee.dto';

@ApiBearerAuth('bearer')
@ApiTags('groups', 'Organization')
@RequireOrganizationManager()
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'Group created successfully',
    type: SafeGroupDto,
  })
  create(
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<SafeGroupDto> {
    return this.groupsService.create(createGroupDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved group successfully',
    type: SafeGroupDto,
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeGroupDto> {
    return this.groupsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a group' })
  @ApiResponse({
    status: 200,
    description: 'Group updated successfully',
    type: SafeGroupDto,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<SafeGroupDto> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a group' })
  @ApiResponse({
    status: 200,
    description: 'Group partially updated successfully',
    type: SafeGroupDto,
  })
  partialUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<SafeGroupDto> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a group' })
  @ApiResponse({
    status: 200,
    description: 'Group soft deleted successfully',
    type: SafeGroupDto,
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeGroupDto> {
    return this.groupsService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted group' })
  @ApiResponse({
    status: 201,
    description: 'Group restored successfully',
    type: SafeGroupDto,
  })
  restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeGroupDto> {
    return this.groupsService.restore(id);
  }

  @Get(':id/employees')
  @ApiOperation({ summary: 'Get all employees in a group by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all employees in a group successfully',
    type: [SafeEmployeeDto],
  })
  getEmployees(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeEmployeeDto[]> {
    return this.groupsService.getEmployees(id);
  }

  @Post(':id/employees/:employeeId')
  @ApiOperation({ summary: 'Add an employee to a group' })
  @ApiResponse({
    status: 201,
    description: 'Employee added successfully',
    type: [SafeEmployeeDto],
  })
  addEmployeeToGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ): Promise<SafeEmployeeDto[]> {
    return this.groupsService.addEmployeeToGroup(id, employeeId);
  }

  @Delete(':id/employees/:employeeId')
  @ApiOperation({ summary: 'Remove an employee of a group' })
  @ApiResponse({
    status: 201,
    description: 'Employee added successfully',
    type: [SafeEmployeeDto],
  })
  removeEmployeeOfGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ): Promise<SafeEmployeeDto[]> {
    return this.groupsService.removeEmployeeOfGroup(id, employeeId);
  }
}
