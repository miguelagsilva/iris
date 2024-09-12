import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { SignUpUserDto } from '../users/dto/sign-up-user.dto';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SafeUserDto } from 'src/users/dto/safe-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { SignedInUserDto } from 'src/users/dto/signed-in-user.dto';
import { SignInUserDto } from 'src/users/dto/sign-in-user.dto';
import { SignInEmployeeDto } from 'src/employees/dto/sign-in-employee.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/employee.entity';
import { SignedInEmployeeDto } from 'src/employees/dto/signed-in-employee.dto';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  private async checkEmptySession(session: Record<string, any>): Promise<void> {
    if (!session.userId && !session.employeeId) {
      session.destroy((err: Error) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
      });
    }
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await argon2.verify(user?.password, password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async signUpUser(
    session: Record<string, any>,
    signUpUserDto: SignUpUserDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.create(signUpUserDto);
    session.userId = user.id;
    return { message: 'Signed up successfully' };
  }

  async signInUser(
    session: Record<string, any>,
    signInUserDto: SignInUserDto,
  ): Promise<{ message: string }> {
    const user = await this.validateUser(signInUserDto.email, signInUserDto.password);
    session.userId = user.id;
    return { message: 'Signed in successfully' };
  }

  async signOutUser(session: Record<string, any>): Promise<{ message: string }> {
    session.userId = null;
    this.checkEmptySession(session);
    return { message: 'Signed out successfully' };
  }

  async changePasswordUser(
    session: Record<string, any>,
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    if (!session.userId) {
      throw new UnauthorizedException('Not logged in');
    }
    await this.validateUser(email, oldPassword);
    if (newPassword === oldPassword) {
      throw new UnauthorizedException(
        'New password must be different from the old password',
      );
    }
    const hashedPassword = await argon2.hash(newPassword);
    const user = await this.usersService.findOneByEmail(email);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
    return { message: 'Changed password successfully' };
  }

  async getProfileUser(session: Record<string, any>): Promise<SignedInUserDto> {
    if (!session.userId) {
      throw new UnauthorizedException('Not logged in');
    }
    const signedInUserDto = await this.usersRepository.findOne({ 
      where: { id: session.userId },
      relations: ["organization"],
    })
    console.log(signedInUserDto)
    return signedInUserDto 
  }

  async updateProfileUser(
    session: Record<string, any>,
    updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    if (!session.userId) {
      throw new UnauthorizedException('Not logged in');
    }
    return await this.usersService.update(session.userId, updateUserDto);
  }

  // Employees

  private generateOTP(): string {
    const digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 6; i++) { 
        OTP += digits[Math.floor(Math.random() * digits.length)]; 
    } 
    return OTP;
  }

  async requestEmployeeOTP(
    phoneNumber: string,
  ): Promise<{ message: string }> {
    const employee = await this.employeesService.findOneByPhoneNumber(phoneNumber);
    if (!employee) {
      throw new UnauthorizedException('Invalid phone number');
    }
    const otp = this.generateOTP();
    await this.employeesService.setNewOTP(employee, otp);
    console.log("employee otp", employee.otp)
    return { message: 'One time password sent successfully' };
  }

  async signInEmployee(
    session: Record<string, any>,
    signInEmployeeDto: SignInEmployeeDto,
  ): Promise<{ message: string }> {
    const employee = await this.employeesService.findOneByPhoneNumber(signInEmployeeDto.phone_number);
    if (!employee || signInEmployeeDto.otp != employee.otp || employee.otp_expires_at.getTime() < Date.now()) {
      throw new UnauthorizedException('Invalid phone number or password');
    }
    employee.otp = null;
    employee.otp_expires_at = null;
    session.employeeId = employee.id;
    return { message: 'Signed in successfully' };
  }

  async signOutEmployee(session: Record<string, any>): Promise<{ message: string }> {
    if (!session.employeeId) {
      throw new UnauthorizedException('Not logged in');
    }
    session.employeeId = null;
    this.checkEmptySession(session);
    return { message: 'Signed out successfully' };
  }

  async getProfileEmployee(session: Record<string, any>): Promise<SignedInEmployeeDto> {
    if (!session.employeeId) {
      throw new UnauthorizedException('Not logged in');
    }
    const signedInEmployeeDto = await this.employeesRepository.findOne({ 
      where: { id: session.employeeId },
      relations: ["organization"],
    })
    console.log(signedInEmployeeDto)
    return signedInEmployeeDto 
  }
}
