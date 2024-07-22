import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { SafeOrganizationDto } from './dto/safe-organization.dto';
import { SafeUserDto } from 'src/users/dto/safe-user.dto';
import { SafeGroupDto } from 'src/groups/dto/safe-group.dto';
import { SafeEmployeeDto } from 'src/employees/dto/safe-employee.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async getOrganization(id: string): Promise<Organization> {
    const organization = await this.organizationsRepository.findOne({
      where: { id: id },
      relations: ['users'],
    });
    if (!organization) {
      throw new NotFoundException(`Organization with id "${id}" not found`);
    }
    return organization;
  }

  // Organization

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<SafeOrganizationDto> {
    const existingOrganization = await this.organizationsRepository.findOne({
      where: { name: createOrganizationDto.name },
      withDeleted: true,
    });
    if (existingOrganization) {
      throw new ConflictException('Organization with this name already exists');
    }

    const savedOrganization = await this.organizationsRepository.save(
      createOrganizationDto,
    );
    return SafeOrganizationDto.fromOrganization(savedOrganization);
  }

  async findAll(): Promise<SafeOrganizationDto[]> {
    const organizations = await this.organizationsRepository.find();
    return organizations.map(SafeOrganizationDto.fromOrganization);
  }

  async findOne(id: string): Promise<SafeOrganizationDto> {
    const organization = await this.getOrganization(id);
    return SafeOrganizationDto.fromOrganization(organization);
  }

  async update(
    id: string,
    updateOrganization: UpdateOrganizationDto,
  ): Promise<SafeOrganizationDto> {
    await this.getOrganization(id);
    await this.organizationsRepository.update(id, updateOrganization);
    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeOrganizationDto> {
    const organization = await this.getOrganization(id);
    await this.organizationsRepository.softDelete(id);
    return SafeOrganizationDto.fromOrganization(organization);
  }

  async restore(id: string): Promise<SafeOrganizationDto> {
    const result = await this.organizationsRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Organization with id "${id}" not found or already restored`,
      );
    }
    return this.findOne(id);
  }

  // Organization

  async addUserToOrganization(
    organizationId: string,
    userId: string,
  ): Promise<SafeUserDto[]> {
    const user = await this.usersService.getUser(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const organization = await this.getOrganization(organizationId);
    if (!organization) {
      throw new NotFoundException(`Organization with id ${organizationId} not found`);
    }
    if (!organization.users) {
      organization.users = [];
    } else if (organization.users.some(u => u.id === userId)) {
      throw new ConflictException(`User with id ${userId} already belongs to organization with id ${organizationId}`);
    }
    organization.users.push(user);

    await this.organizationsRepository.save(organization);

    return this.getOrganizationEntities<SafeUserDto>(organizationId, 'users');
  }

  async removeUserFromOrganization(organizationId: string, userId: string): Promise<SafeUserDto[]> {
    const user = await this.usersService.getUser(userId);
    if (!user.organization) {
      throw new NotFoundException(
        `User with ID "${userId}" is not assigned to any organization`,
      );
    }
    const organization = await this.getOrganization(organizationId);
    if (!organization) {
      throw new NotFoundException(`Organization with id ${organizationId} not found`);
    }
    if (!organization.users || organization.users.length == 0) {
      return [];
    }

    organization.users = organization.users.filter(u => u.id !== userId)
    await this.organizationsRepository.save(organization);
    return this.getOrganizationEntities<SafeUserDto>(organizationId, 'users');
  }

  // Users, groups and employees

  async getOrganizationEntities<T>(
    id: string, 
    entityType: 'users' | 'groups' | 'employees'
  ): Promise<T[]> {
    const organization = await this.organizationsRepository.findOne({
      where: { id },
      relations: [entityType],
    });
    if (!organization) {
      throw new NotFoundException(`Organization with id "${id}" not found`);
    }

    const entities = organization[entityType];

    const transformMethod = {
      users: SafeUserDto.fromUser,
      groups: SafeGroupDto.fromGroup,
      employees: SafeEmployeeDto.fromEmployee
    }[entityType] as (entity: any) => T;

    return entities.map(transformMethod);
  }
}
