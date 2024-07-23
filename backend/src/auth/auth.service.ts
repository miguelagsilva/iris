import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInUserDto } from '../users/dto/sign-in-user.dto';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from '../users/dto/sign-up-user.dto';
import { AccessToken } from './auth.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from '../roles/roles.enum';
import * as argon2 from 'argon2';
import { forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInUserDto: SignInUserDto): Promise<AccessToken> {
    const user = await this.usersService.findOneByEmail(signInUserDto.email);
    if (
      user == null ||
      !(await argon2.verify(user?.password, signInUserDto.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpUserDto: SignUpUserDto): Promise<AccessToken> {
    const createUserDto = new CreateUserDto();
    Object.assign(createUserDto, signUpUserDto, { role: Role.USER });

    const safeUserDto = await this.usersService.create(createUserDto);

    const payload = { sub: safeUserDto.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
