import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { SignUpUserDto } from '../users/dto/sign-up-user.dto';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (user == null || !(await argon2.verify(user?.password, password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async signUpUser(session: Record<string, any>, signUpUserDto: SignUpUserDto) {
    const user = await this.usersService.create(signUpUserDto);
    session.userId = user.id;
    return { message: 'Signed up successfully' };
  }

  async signInUser(
    session: Record<string, any>,
    email: string,
    password: string,
  ) {
    const user = await this.validateUser(email, password);
    session.userId = user.id;
    return { message: 'Signed in successfully' };
  }

  async signOut(session: Record<string, any>) {
    session.destroy((err: Error) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
    return { message: 'Signed out successfully' };
  }

  async changePasswordUser(
    session: Record<string, any>,
    email: string,
    oldPassword: string,
    newPassword: string,
  ) {
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
}
