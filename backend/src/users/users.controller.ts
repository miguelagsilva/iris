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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { SafeUserDto } from './dto/safe-user.dto';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';
import { PaginationDto } from '../common/dto/pagination.dto';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard, Roles } from '../auth/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin

  @Post()
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: SafeUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<SafeUserDto> {
    return (await this.usersService.create(createUserDto)).toSafeUser();
  }

  @Get()
  @ApiTags('Admin')
  @UseGuards(AuthGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all users successfully',
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
    @Query() paginationDto: PaginationDto<User>,
  ): Promise<PaginationResult<SafeUserDto>> {
    return this.usersService.paginate(paginationDto);
  }

  @Get(':id')
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
}
