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
import { EmployeesService } from './employees.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { SafeEmployeeDto } from './dto/safe-employee.dto';
import { RequireOrganizationManager } from 'src/auth/auth.decorators';
import { GroupsService } from 'src/groups/groups.service';
import { Inject, forwardRef } from '@nestjs/common'

@ApiBearerAuth('bearer')
@ApiTags('employees', 'Organization')
@RequireOrganizationManager()
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    @Inject(forwardRef(() => GroupsService))
    private groupsService: GroupsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully',
    type: SafeEmployeeDto,
  })
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<SafeEmployeeDto> {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved employee successfully',
    type: SafeEmployeeDto,
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeEmployeeDto> {
    return this.employeesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a employee' })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully',
    type: SafeEmployeeDto,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<SafeEmployeeDto> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a employee' })
  @ApiResponse({
    status: 200,
    description: 'Employee partially updated successfully',
    type: SafeEmployeeDto,
  })
  partialUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<SafeEmployeeDto> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a employee' })
  @ApiResponse({
    status: 200,
    description: 'Employee soft deleted successfully',
    type: SafeEmployeeDto,
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeEmployeeDto> {
    return this.employeesService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee restored successfully',
    type: SafeEmployeeDto,
  })
  restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeEmployeeDto> {
    return this.employeesService.restore(id);
  }

  @Get(':id/groups')
  @ApiOperation({ summary: 'Get all groups of an employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved employees groups successfully',
    type: [SafeEmployeeDto],
  })
  getEmployees(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeEmployeeDto[]> {
    return this.groupsService.getEmployees(id);
  }

  @Post(':id/groups/:groupId')
  @ApiOperation({ summary: 'Add an employee to a group' })
  @ApiResponse({
    status: 201,
    description: 'Employee added successfully',
    type: [SafeEmployeeDto],
  })
  addEmployeeToGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<SafeEmployeeDto[]> {
    return this.groupsService.addEmployeeToGroup(groupId, id);
  }

  @Delete(':id/group/:groupId')
  @ApiOperation({ summary: 'Remove an employee of a group' })
  @ApiResponse({
    status: 201,
    description: 'Employee removed successfully',
    type: [SafeEmployeeDto],
  })
  removeEmployeeOfGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<SafeEmployeeDto[]> {
    return this.groupsService.removeEmployeeOfGroup(groupId, id);
  }
}
