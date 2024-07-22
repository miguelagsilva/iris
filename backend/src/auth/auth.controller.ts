import { Controller, Post, Body } from '@nestjs/common';
import { SignInUserDto } from '../users/dto/sign-in-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './auth.decorators';
import { AccessToken } from './auth.entity';
import { SignUpUserDto } from '../users/dto/sign-up-user.dto';

@ApiTags('auth', 'Public')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign into an account' })
  @ApiResponse({
    status: 201,
    description: 'Signed in successfully',
    type: AccessToken,
  })
  signIn(@Body() signInUserDto: SignInUserDto): Promise<AccessToken> {
    return this.authService.signIn(signInUserDto);
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: 201,
    description: 'Signed up successfully',
    type: AccessToken,
  })
  signUp(@Body() signUpUserDto: SignUpUserDto): Promise<AccessToken> {
    return this.authService.signUp(signUpUserDto);
  }
}
