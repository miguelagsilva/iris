import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { SafeGroupDto } from './dto/safe-group.dto';
import { SafeEmployeeDto } from '../employees/dto/safe-employee.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { EmployeesService } from '../employees/employees.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @Inject(forwardRef(() => EmployeesService))
    private employeesService: EmployeesService,
    @Inject(forwardRef(() => OrganizationsService))
    private organizationService: OrganizationsService,
  ) {}

  private async checkGroupExistence(name: string, organizationId: string) {
    const existingGroup = await this.groupsRepository.findOne({
      where: {
        name: name,
        organization: { id: organizationId },
      },
    });
    if (existingGroup) {
      throw new ConflictException(
        'Group with this name already exists in the organization',
      );
    }
  }

  async getGroup(id: string): Promise<Group> {
    const group = await this.groupsRepository.findOne({
      where: { id: id },
      relations: ['organization', 'employees'],
    });
    if (!group) {
      throw new NotFoundException(`Group with id "${id}" not found`);
    }
    return group;
  }

  // CRUD

  async create(createGroupDto: CreateGroupDto): Promise<SafeGroupDto> {
    await this.checkGroupExistence(
      createGroupDto.name,
      createGroupDto.organizationId,
    );
    const { organizationId, ...newGroup } = createGroupDto;
    const organization =
      await this.organizationService.getOrganization(organizationId);
    const createdGroup = this.groupsRepository.create({
      ...newGroup,
      organization,
    });
    await this.groupsRepository.save(createdGroup);
    return this.findOne(createdGroup.id);
  }

  async paginate(
    paginationDto: PaginationDto<Group>,
  ): Promise<PaginationResult<SafeGroupDto>> {
    let { page, limit } = paginationDto;
    const { filter, sortBy, sortOrder } = paginationDto;
    page = page || 1;
    limit = limit || 10;
    const skip = (page - 1) * limit;
    const sort = sortBy
      ? { [sortBy]: sortOrder }
      : ({ id: 'ASC' } as FindOptionsOrder<Group>);
    const [items, total] = await this.groupsRepository.findAndCount({
      where: [ filter ],
      order: sort,
      take: limit,
      skip: skip,
      relations: ['organization'],
    });
    const safeItems = items.map((i) => i.toSafeGroup());
    return {
      items: safeItems,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<SafeGroupDto> {
    const group = await this.getGroup(id);
    return group.toSafeGroup();
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<SafeGroupDto> {
    const group = await this.getGroup(id);
    await this.checkGroupExistence(updateGroupDto.name, group.organization.id);
    await this.groupsRepository.update(id, updateGroupDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeGroupDto> {
    const group = await this.getGroup(id);
    await this.groupsRepository.softDelete(id);
    return group.toSafeGroup();
  }

  async restore(id: string): Promise<SafeGroupDto> {
    await this.groupsRepository.restore(id);
    return this.findOne(id);
  }

  // Relationships

  async getEmployees(id: string): Promise<SafeEmployeeDto[]> {
    const group = await this.getGroup(id);
    return group.getEmployees().map((e) => e.toSafeEmployee());
  }

  async addEmployeeToGroup(
    employeeId: string,
    groupId: string,
  ): Promise<SafeEmployeeDto[]> {
    const group = await this.getGroup(groupId);
    const employee = await this.employeesService.getEmployee(employeeId);
    group.addEmployee(employee);
    await this.groupsRepository.save(group);
    await this.employeesService.save(employee);
    const updatedGroup = await this.getGroup(groupId);
    return updatedGroup.employees.map((e) => e.toSafeEmployee());
  }

  async removeEmployeeFromGroup(
    employeeId: string,
    groupId: string,
  ): Promise<SafeGroupDto> {
    const group = await this.getGroup(groupId);
    const employee = await this.employeesService.getEmployee(employeeId);
    group.removeEmployee(employee);
    const savedGroup = await this.groupsRepository.save(group);
    return savedGroup.toSafeGroup();
  }
}
