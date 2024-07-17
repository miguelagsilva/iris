import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SafeUserDto } from './dto/safe-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private toSafeUser(user: User): SafeUserDto {
    const { password, createdAt, updatedAt, deletedAt, ...safeUser } = user;
    return safeUser as SafeUserDto;
  }

  async create(createUserDto: CreateUserDto): Promise<SafeUserDto> {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    const savedUser = await this.usersRepository.save(createUserDto);
    return this.toSafeUser(savedUser);
  }

  async findAll(): Promise<SafeUserDto[]> {
    const users = await this.usersRepository.find();
    return users.map(this.toSafeUser);
  }

  async findOne(id: string): Promise<SafeUserDto> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return this.toSafeUser(user);
  }

  async update(id: string, updateUser: UpdateUserDto): Promise<SafeUserDto> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    await this.usersRepository.update(id, updateUser);
    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeUserDto> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    await this.usersRepository.softDelete(id);
    return this.toSafeUser(user);
  }

  async restore(id: string): Promise<SafeUserDto> {
    const result = await this.usersRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `User with ID "${id}" not found or already restored`,
      );
    }
    return this.findOne(id);
  }
}
