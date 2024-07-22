import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { SafeGroupDto } from './dto/safe-group.dto';
import { SafeEmployeeDto } from 'src/employees/dto/safe-employee.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { Inject, forwardRef } from '@nestjs/common'
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    private employeesService: EmployeesService,
    @Inject(forwardRef(() => OrganizationsService))
    private organizationService: OrganizationsService,
  ) {}

  private async getGroup(id: string): Promise<Group> {
    const group = await this.groupsRepository.findOne({
      where: { id: id },
      relations: ['organization', 'employees'],
    });
    if (!group) {
      throw new NotFoundException(`Group with id "${id}" not found`);
    }
    return group;
  }

  async create(
    createGroupDto: CreateGroupDto,
  ): Promise<SafeGroupDto> {
    const existingGroup = await this.groupsRepository.findOne({
      where: {
        name: createGroupDto.name,
        organization: { id: createGroupDto.organizationId },
      },
    });
    if (existingGroup) {
      throw new ConflictException(
        'Group with this name already exists in the organization',
      );
    }

    const { organizationId, ...newGroup } = createGroupDto; 

    const organization = await this.organizationService.findOne(organizationId);
    if (!organization) {
      throw new NotFoundException(`Organization with id "${organizationId}" not found`);
    }

    const savedGroup = await this.groupsRepository.save({ ...newGroup, organization });

    return SafeGroupDto.fromGroup(savedGroup);
  }

  async findAll(): Promise<SafeGroupDto[]> {
    const groups = await this.groupsRepository.find();
    return groups.map(SafeGroupDto.fromGroup);
  }

  async findOne(id: string): Promise<SafeGroupDto> {
    const group = await this.getGroup(id);
    return SafeGroupDto.fromGroup(group);
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<SafeGroupDto> {
    const existingGroup = await this.groupsRepository.findOne({
      where: {
        name: updateGroupDto.name,
        organization: { id: updateGroupDto.organizationId },
      },
    });
    if (existingGroup) {
      throw new ConflictException(
        'Group with this name already exists in the organization',
      );
    }

    await this.groupsRepository.update(id, updateGroupDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeGroupDto> {
    const group = await this.getGroup(id);
    await this.groupsRepository.softDelete(id);
    return SafeGroupDto.fromGroup(group);
  }

  async restore(id: string): Promise<SafeGroupDto> {
    const result = await this.groupsRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Group with id "${id}" not found or already restored`,
      );
    }
    return this.findOne(id);
  }

  // Employees

  async getEmployees(id: string): Promise<SafeEmployeeDto[]> {
    const group = await this.getGroup(id);
    const employees = group.employees; 
    console.log(group)
    if (!employees) {
      return [];
    }
    return employees.map(SafeEmployeeDto.fromEmployee);
  }


  async addEmployeeToGroup(groupId: string, employeeId: string): Promise<SafeEmployeeDto[]> {
    const group = await this.getGroup(groupId);
    if (!group) {
      throw new NotFoundException(`Group with id ${groupId} not found`);
    }
    const employee = await this.employeesService.getEmployee(employeeId);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }
    if (group.organization.id !== employee.organization.id) {
      throw new ConflictException(`Employee and group do not belong to the same organization`);
    }
    if (!group.employees) {
      group.employees = [];
    } else if (group.employees.some(e => e.id === employeeId)) {
      throw new ConflictException(`Employee with id ${employeeId} already belongs to group with id ${groupId}`);
    }

    group.employees.push(employee);

    await this.groupsRepository.save(group);

    return this.getEmployees(groupId); 
  }

  async removeEmployeeOfGroup(groupId: string, employeeId: string): Promise<SafeEmployeeDto[]> {
    const group = await this.getGroup(groupId);
    group.employees = group.employees.filter(e => e.id !== employeeId)
    await this.groupsRepository.save(group);
    return this.getEmployees(groupId); 
  }
}
