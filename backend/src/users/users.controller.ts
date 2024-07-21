import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Request,
  Param,
  Delete,
  ParseUUIDPipe,
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

@ApiBearerAuth('bearer')
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin

  @Post()
  @Roles(Role.ADMIN)
  @ApiTags('Admin')
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
  @ApiTags('Admin')
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
  @Roles(Role.ADMIN)
  @ApiTags('Admin')
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
  @Roles(Role.ADMIN)
  @ApiTags('Admin')
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
  @Roles(Role.ADMIN)
  @ApiTags('Admin')
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
  @Roles(Role.ADMIN)
  @ApiTags('Admin')
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
  @Roles(Role.ADMIN)
  @ApiTags('Admin')
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

  // User

  @Get('me')
  @Roles(Role.USER)
  @ApiTags('User')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved own user profile successfully',
    type: SafeUserDto,
  })
  getCurrentUser(@Request() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  @Roles(Role.USER)
  @ApiTags('User')
  @ApiOperation({ summary: 'Partially update own profile' })
  @ApiResponse({
    status: 200,
    description: 'Updated own user profile successfully',
    type: SafeUserDto,
  })
  updateCurrentUser(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }
}
