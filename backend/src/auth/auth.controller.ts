import {
  Controller,
  Post,
  Body,
  Session,
  Get,
  Patch,
  Request,
} from '@nestjs/common';
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
import { SafeUserDto } from 'src/users/dto/safe-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { SignedInUserDto } from 'src/users/dto/signed-in-user.dto';
import { SignInEmployeeDto } from 'src/employees/dto/sign-in-employee.dto';
import { RequestOTPEmployeeDto } from 'src/employees/dto/request-otp-employee.dto';
import { SafeEmployeeDto } from 'src/employees/dto/safe-employee.dto';
import { SignedInEmployeeDto } from 'src/employees/dto/signed-in-employee.dto';

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
  ): Promise<{ message: string }> {
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
  ): Promise<{ message: string }> {
    return this.authService.signInUser(
      session,
      signInUserDto,
    );
  }

  @Post('user/sign-out')
  @ApiOperation({ summary: 'Sign out as a user' })
  @ApiResponse({
    status: 201,
    description: 'Signed out successfully',
  })
  @ApiCookieAuth()
  signOutUser(
    @Session() session: Record<string, any>,
  ): Promise<{ message: string }> {
    return this.authService.signOutUser(session);
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
  ): Promise<{ message: string }> {
    return this.authService.changePasswordUser(
      session,
      changePasswordUserDto.email,
      changePasswordUserDto.oldPassword,
      changePasswordUserDto.newPassword,
    );
  }

  @Get('user/profile')
  @ApiOperation({ summary: 'Get own user profile' })
  @ApiResponse({
    status: 201,
    description: 'Retrieved profile successfully',
    type: SafeUserDto,
  })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @ApiCookieAuth()
  getProfileUser(
    @Session() session: Record<string, any>,
  ): Promise<SignedInUserDto> {
    return this.authService.getProfileUser(session);
  }

  @Patch('user/profile')
  @ApiOperation({ summary: 'Get own user profile' })
  @ApiResponse({
    status: 201,
    description: 'Retrieved profile successfully',
    type: SafeUserDto,
  })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @ApiCookieAuth()
  updateProfileUser(
    @Session() session: Record<string, any>,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    return this.authService.updateProfileUser(session, updateUserDto);
  }

  // Employees

  @Post('employee/request-otp')
  @ApiOperation({ summary: 'Request a otp for an employee' })
  @ApiResponse({
    status: 201,
    description: 'One time password sent successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid phone number' })
  requestEmployeeOTP(
    @Body() requestOTPEmployeeDto: RequestOTPEmployeeDto,
  ): Promise<{ message: string }> {
    return this.authService.requestEmployeeOTP(requestOTPEmployeeDto.phone_number);
  }

  @Post('employee/sign-in')
  @ApiOperation({ summary: 'Sign in as a employee' })
  @ApiResponse({
    status: 201,
    description: 'Signed in successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signInEmployee(
    @Session() session: Record<string, any>,
    @Body() signInEmployeeDto: SignInEmployeeDto,
  ): Promise<{ message: string }> {
    return this.authService.signInEmployee(
      session,
      signInEmployeeDto
    );
  }

  @Post('employee/sign-out')
  @ApiOperation({ summary: 'Sign out as a employee' })
  @ApiResponse({
    status: 201,
    description: 'Signed out successfully',
  })
  @ApiCookieAuth()
  signOutEmployee(
    @Session() session: Record<string, any>,
  ): Promise<{ message: string }> {
    return this.authService.signOutEmployee(session);
  }

  @Get('employee/profile')
  @ApiOperation({ summary: 'Get own employee profile' })
  @ApiResponse({
    status: 201,
    description: 'Retrieved profile successfully',
    type: SafeEmployeeDto,
  })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @ApiCookieAuth()
  getProfileEmployee(
    @Session() session: Record<string, any>,
  ): Promise<SignedInEmployeeDto> {
    return this.authService.getProfileEmployee(session);
  }
}
