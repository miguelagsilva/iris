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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SafeUserDto } from './dto/safe-user.dto';
import { AssignOrganizationDto } from './dto/assign-organization.dto';
import { Role } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { Public } from 'src/auth/auth.decorators';

@ApiBearerAuth('bearer')
@ApiTags('users')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // Todo ensure role auth

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: SafeUserDto,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<SafeUserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all users successfully',
    type: [SafeUserDto],
  })
  findAll(): Promise<SafeUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved user successfully',
    type: SafeUserDto,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SafeUserDto> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: SafeUserDto,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a user' })
  @ApiResponse({
    status: 200,
    description: 'User partially updated successfully',
    type: SafeUserDto,
  })
  partialUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User soft deleted successfully',
    type: SafeUserDto,
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<SafeUserDto> {
    return this.usersService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted user' })
  @ApiResponse({
    status: 201,
    description: 'User restored successfully',
    type: SafeUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or already restored',
  })
  restore(@Param('id', ParseUUIDPipe) id: string): Promise<SafeUserDto> {
    return this.usersService.restore(id);
  }

  @Patch(':id/organization')
  @ApiOperation({ summary: 'Assign or change a users organization' })
  @ApiResponse({
    status: 200,
    description: 'Users organization changed successfully',
    type: SafeUserDto,
  })
  assignOrganization(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignOrganizationDto: AssignOrganizationDto,
  ): Promise<SafeUserDto> {
    return this.usersService.assignOrganization(id, assignOrganizationDto);
  }

  @Delete(':id/organization')
  @ApiOperation({ summary: 'Remove a user from an organization' })
  @ApiResponse({
    status: 200,
    description: 'User removed from organization successfully',
    type: SafeUserDto,
  })
  removeFromOrganization(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SafeUserDto> {
    return this.usersService.removeFromOrganization(id);
  }
}
