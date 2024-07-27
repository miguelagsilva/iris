import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { SafeOrganizationDto } from './dto/safe-organization.dto';
import { SafeUserDto } from '../users/dto/safe-user.dto';
import { UsersService } from '../users/users.service';
import { SafeGroupDto } from '../groups/dto/safe-group.dto';
import { SafeEmployeeDto } from '../employees/dto/safe-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  private async checkOrganizationExistence(code: string) {
    const existingOrganization = await this.organizationsRepository.findOne({
      where: { code: code },
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

  // CRUD

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<SafeOrganizationDto> {
    await this.checkOrganizationExistence(createOrganizationDto.code);
    const createdOrganization = this.organizationsRepository.create(
      createOrganizationDto,
    );
    const savedOrganization =
      await this.organizationsRepository.save(createdOrganization);
    return await this.findOne(savedOrganization.id);
  }

  async paginate(
    paginationDto: PaginationDto<Organization>,
  ): Promise<PaginationResult<SafeOrganizationDto>> {
    let { page, limit } = paginationDto;
    const { filter, sortBy, sortOrder } = paginationDto;
    page = page || 1;
    limit = limit || 20;
    const skip = (page - 1) * limit;
    const sort = sortBy
      ? { [sortBy]: sortOrder }
      : ({ id: 'ASC' } as FindOptionsOrder<Organization>);
    const [items, total] = await this.organizationsRepository.findAndCount({
      where: filter,
      order: sort,
      take: limit,
      skip: skip,
    });
    const safeItems = items.map((i) => i.toSafeOrganization());
    return {
      items: safeItems,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
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
    await this.checkOrganizationExistence(updateOrganizationDto.code);
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
