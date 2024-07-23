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
import { RequireOrganizationManager } from '../auth/auth.decorators';
import { SafeGroupDto } from 'src/groups/dto/safe-group.dto';

@ApiBearerAuth('bearer')
@ApiTags('employees', 'Organization')
@RequireOrganizationManager()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

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
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SafeEmployeeDto> {
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
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<SafeEmployeeDto> {
    return this.employeesService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee restored successfully',
    type: SafeEmployeeDto,
  })
  restore(@Param('id', ParseUUIDPipe) id: string): Promise<SafeEmployeeDto> {
    return this.employeesService.restore(id);
  }

  @Get(':id/groups')
  @ApiOperation({ summary: 'Get all groups of an employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved employees groups successfully',
    type: [SafeGroupDto],
  })
  getGroups(@Param('id', ParseUUIDPipe) id: string): Promise<SafeGroupDto[]> {
    return this.employeesService.getGroups(id);
  }

  @Post(':id/groups/:groupId')
  @ApiOperation({ summary: 'Add group to an employee' })
  @ApiResponse({
    status: 201,
    description: 'Group added successfully',
    type: SafeEmployeeDto,
  })
  addGroupToEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<SafeEmployeeDto> {
    return this.employeesService.addGroupToEmployee(groupId, id);
  }

  @Delete(':id/group/:groupId')
  @ApiOperation({ summary: 'Remove group from an employee' })
  @ApiResponse({
    status: 200,
    description: 'Group removed successfully',
    type: SafeEmployeeDto,
  })
  removeGroupFromEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<SafeEmployeeDto> {
    return this.employeesService.removeGroupFromEmployee(groupId, id);
  }
}
