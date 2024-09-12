import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserInvitesService } from './user-invites.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserInvite } from './user-invite.entity';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';

@ApiTags('userInvites')
@Controller('userInvites')
export class UserInvitesController {
  constructor(private readonly userInvitesService: UserInvitesService) {}

  // Admin

  @Post()
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Create a new user invite' })
  @ApiResponse({
    status: 201,
    description: 'User invite created successfully',
    type: UserInvite,
  })
  async create(@Body() createUserInviteDto: CreateUserInviteDto): Promise<UserInvite> {
    return await this.userInvitesService.create(createUserInviteDto);
  }

  @Get(':id')
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Get a user invite by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved user invite successfully',
    type: UserInvite,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserInvite> {
    return this.userInvitesService.findOne(id);
  }
}
