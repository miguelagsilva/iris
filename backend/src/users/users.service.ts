import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SafeUserDto } from './dto/safe-user.dto';
import * as argon2 from 'argon2';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async checkUserExistence(email: string) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: email },
      withDeleted: true,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['organization'],
    });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  // User

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkUserExistence(createUserDto.email);
    createUserDto.password = await argon2.hash(createUserDto.password);
    const savedUser = await this.usersRepository.save(createUserDto);
    return await this.getUser(savedUser.id);
  }

  async paginate(
    paginationDto: PaginationDto<User>,
  ): Promise<PaginationResult<SafeUserDto>> {
    let { page, limit } = paginationDto;
    const { filter, sortBy, sortOrder } = paginationDto;
    page = page || 1;
    limit = limit || 20;
    const skip = (page - 1) * limit;
    const sort = sortBy
      ? { [sortBy]: sortOrder }
      : ({ id: 'ASC' } as FindOptionsOrder<User>);
    const [items, total] = await this.usersRepository.findAndCount({
      where: filter,
      order: sort,
      take: limit,
      skip: skip,
    });
    const safeItems = items.map((i) => i.toSafeUser());
    return {
      items: safeItems,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<SafeUserDto> {
    const user = await this.getUser(id);
    return user.toSafeUser();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<SafeUserDto> {
    await this.getUser(id);
    await this.checkUserExistence(updateUserDto.email);
    updateUserDto.password = await argon2.hash(updateUserDto.password);
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeUserDto> {
    const user = await this.getUser(id);
    await this.usersRepository.softDelete(id);
    return user.toSafeUser();
  }

  async restore(id: string): Promise<SafeUserDto> {
    await this.usersRepository.restore(id);
    return this.findOne(id);
  }

  // Auth

  async findOneByEmail(email: string): Promise<User | undefined> {
    return (
      (await this.usersRepository.findOneBy({ email: email })) || undefined
    );
  }

  async changeUserPassword(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.findOneByEmail(email);
    user.password = await argon2.hash(password);
    await this.usersRepository.save(user);
    return user;
  }
}
