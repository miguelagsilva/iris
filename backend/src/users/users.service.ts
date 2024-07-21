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
import { AssignOrganizationDto } from './dto/assign-organization.dto';
import { OrganizationsService } from 'src/organizations/organizations.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private organizationsService: OrganizationsService,
  ) {}

  private async getUser(id: string): Promise<User> {
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

  async create(createUserDto: CreateUserDto): Promise<SafeUserDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });
    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists',
      );
    }

    const hashedPassword = await argon2.hash(createUserDto.password);
    createUserDto.password = hashedPassword;

    const savedUser = await this.usersRepository.save(createUserDto);
    return SafeUserDto.fromUser(savedUser);
  }

  async findAll(): Promise<SafeUserDto[]> {
    const users = await this.usersRepository.find();
    return users.map(SafeUserDto.fromUser);
  }

  async findOne(id: string): Promise<SafeUserDto> {
    const user = await this.getUser(id);
    return SafeUserDto.fromUser(user);
  }

  async update(id: string, updateUser: UpdateUserDto): Promise<SafeUserDto> {
    await this.getUser(id);
    await this.usersRepository.update(id, updateUser);
    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeUserDto> {
    const user = await this.getUser(id);
    await this.usersRepository.softDelete(id);
    return SafeUserDto.fromUser(user);
  }

  async restore(id: string): Promise<SafeUserDto> {
    const result = await this.usersRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `User with id "${id}" not found or already restored`,
      );
    }
    return this.findOne(id);
  }

  // Organization

  async assignOrganization(
    id: string,
    assignOrganizationDto: AssignOrganizationDto,
  ): Promise<SafeUserDto> {
    const user = await this.getUser(id);
    const organization = await this.organizationsService.getOrganization(
      assignOrganizationDto.organizationId,
    );
    user.organization = organization;
    const savedUser = await this.usersRepository.save(user);
    return SafeUserDto.fromUser(savedUser);
  }

  async removeFromOrganization(id: string): Promise<SafeUserDto> {
    const user = await this.getUser(id);
    if (!user.organization) {
      throw new NotFoundException(
        `User with ID "${id}" is not assigned to any organization`,
      );
    }
    user.organization = null;
    const savedUser = await this.usersRepository.save(user);
    return SafeUserDto.fromUser(savedUser);
  }

  // Auth
  
  async AuthFindOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email: email });
    return user;
  }
}
