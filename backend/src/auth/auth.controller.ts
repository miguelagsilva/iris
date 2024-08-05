import { Controller, Post, Body, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from 'src/users/dto/sign-up-user.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignInUserDto } from 'src/users/dto/sign-in-user.dto';
import { ChangePasswordUserDto } from 'src/users/dto/change-password-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user/sign-up')
  @ApiOperation({ summary: 'Sign up as a user' })
  @ApiResponse({
    status: 201,
    description: 'Signed up successfully',
  })
  signUpUser(
    @Session() session: Record<string, any>,
    @Body() signUpUserDto: SignUpUserDto,
  ) {
    return this.authService.signUpUser(session, signUpUserDto);
  }

  @Post('user/sign-in')
  @ApiOperation({ summary: 'Sign in as a user' })
  @ApiResponse({
    status: 201,
    description: 'Signed in successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signInUser(
    @Session() session: Record<string, any>,
    @Body() signInUserDto: SignInUserDto,
  ) {
    return this.authService.signInUser(
      session,
      signInUserDto.email,
      signInUserDto.password,
    );
  }

  @Post('user/sign-out')
  @ApiOperation({ summary: 'Sign out as a user' })
  @ApiResponse({
    status: 201,
    description: 'Signed out successfully',
  })
  @ApiCookieAuth()
  signOutUser(@Session() session: Record<string, any>) {
    return this.authService.signOut(session);
  }

  @Post('user/change-password')
  @ApiOperation({ summary: 'Change password as a user' })
  @ApiResponse({
    status: 201,
    description: 'Changed password successfully',
  })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @ApiResponse({ status: 403, description: 'Invalid old password' })
  @ApiCookieAuth()
  changePassword(
    @Session() session: Record<string, any>,
    @Body() changePasswordUserDto: ChangePasswordUserDto,
  ) {
    return this.authService.changePasswordUser(
      session,
      changePasswordUserDto.email,
      changePasswordUserDto.oldPassword,
      changePasswordUserDto.newPassword,
    );
  }
}
