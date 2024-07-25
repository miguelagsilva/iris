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
import { SafeUserDto } from '../users/dto/safe-user.dto';
import { UsersService } from '../users/users.service';
import { SafeGroupDto } from 'src/groups/dto/safe-group.dto';
import { SafeEmployeeDto } from 'src/employees/dto/safe-employee.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  private async checkOrganizationExistence(name: string) {
    const existingOrganization = await this.organizationsRepository.findOne({
      where: { name: name },
      withDeleted: true,
    });
    if (existingOrganization) {
      throw new ConflictException('Organization with this name already exists');
    }
  }

  async getOrganization(id: string): Promise<Organization> {
    const organization = await this.organizationsRepository.findOne({
      where: { id: id },
      relations: ['users', 'employees', 'groups'],
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
    this.checkOrganizationExistence(createOrganizationDto.name);
    const createdOrganization = this.organizationsRepository.create(
      createOrganizationDto,
    );
    const savedOrganization =
      await this.organizationsRepository.save(createdOrganization);
    return await this.findOne(savedOrganization.id);
  }

  async findAll(): Promise<SafeOrganizationDto[]> {
    const organizations = await this.organizationsRepository.find();
    return organizations.map((o) => o.toSafeOrganization());
  }

  async findOne(id: string): Promise<SafeOrganizationDto> {
    const organization = await this.getOrganization(id);
    return organization.toSafeOrganization();
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<SafeOrganizationDto> {
    await this.getOrganization(id);
    await this.checkOrganizationExistence(updateOrganizationDto.name);
    await this.organizationsRepository.update(id, updateOrganizationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeOrganizationDto> {
    const organization = await this.getOrganization(id);
    await this.organizationsRepository.softDelete(id);
    return organization.toSafeOrganization();
  }

  async restore(id: string): Promise<SafeOrganizationDto> {
    await this.organizationsRepository.restore(id);
    return this.findOne(id);
  }

  // Organization

  async addUserToOrganization(
    organizationId: string,
    userId: string,
  ): Promise<SafeUserDto[]> {
    const user = await this.usersService.getUser(userId);
    const organization = await this.getOrganization(organizationId);
    organization.addUser(user);
    await this.organizationsRepository.save(organization);
    await this.usersService.save(user);
    const updatedOrganization = await this.getOrganization(organizationId);
    return updatedOrganization.users.map((u) => u.toSafeUser());
  }

  async removeUserFromOrganization(
    organizationId: string,
    userId: string,
  ): Promise<SafeUserDto[]> {
    const user = await this.usersService.getUser(userId);
    const organization = await this.getOrganization(organizationId);
    organization.removeUser(user);
    await this.organizationsRepository.save(organization);
    await this.usersService.save(user);
    const updatedOrganization = await this.getOrganization(organizationId);
    return updatedOrganization.users.map((u) => u.toSafeUser());
  }

  // Users, groups and employees

  async getOrganizationUsers(id: string): Promise<SafeUserDto[]> {
    const organization = await this.getOrganization(id);
    return organization.getUsers().map((o) => o.toSafeUser());
  }

  async getOrganizationEmployees(id: string): Promise<SafeEmployeeDto[]> {
    const organization = await this.getOrganization(id);
    return organization.getEmployees().map((e) => e.toSafeEmployee());
  }

  async getOrganizationGroups(id: string): Promise<SafeGroupDto[]> {
    const organization = await this.getOrganization(id);
    return organization.getGroups().map((g) => g.toSafeGroup());
  }
}
