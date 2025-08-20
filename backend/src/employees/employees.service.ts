import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { SafeEmployeeDto } from './dto/safe-employee.dto';
import { SafeGroupDto } from '../groups/dto/safe-group.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { GroupsService } from '../groups/groups.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @Inject(forwardRef(() => GroupsService))
    private groupsService: GroupsService,
    @Inject(forwardRef(() => OrganizationsService))
    private organizationService: OrganizationsService,
  ) {}

  private async checkEmployeeExistence(phoneNumber: string) {
    const existingEmployee = await this.employeesRepository.findOne({
      where: {
        phone_number: phoneNumber,
      },
    });
    if (existingEmployee) {
      throw new ConflictException(
        'Employee with this phone number already exists.',
      );
    }
  }

  async save(employee: Employee): Promise<Employee> {
    return await this.employeesRepository.save(employee);
  }

  async getEmployee(id: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { id: id },
      relations: ['organization', 'groups'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee with id "${id}" not found`);
    }
    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<SafeEmployeeDto> {
    await this.checkEmployeeExistence(createEmployeeDto.phone_number);
    const { organizationId, ...newEmployee } = createEmployeeDto;
    const organization =
      await this.organizationService.getOrganization(organizationId);
    const groups = await this.groupsService.checkGroupsBelongToOrganization(
      createEmployeeDto.groupsIds,
      organizationId,
    );
    const createdEmployee = this.employeesRepository.create({
      ...newEmployee,
      organization,
      groups,
    });
    await this.employeesRepository.save(createdEmployee);
    return this.findOne(createdEmployee.id);
  }

  async paginate(
    paginationDto: PaginationDto<Employee>,
  ): Promise<PaginationResult<SafeEmployeeDto>> {
    let { page, limit } = paginationDto;
    const { filter, sortBy, sortOrder } = paginationDto;
    page = page || 1;
    limit = limit || 10;
    const skip = (page - 1) * limit;
    const sort = sortBy
      ? { [sortBy]: sortOrder }
      : ({ id: 'ASC' } as FindOptionsOrder<Employee>);
    const [items, total] = await this.employeesRepository.findAndCount({
      where: [filter],
      order: sort,
      take: limit,
      skip: skip,
      relations: ['organization'],
    });
    const safeItems = items.map((i) => i.toSafeEmployee());
    return {
      items: safeItems,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<SafeEmployeeDto> {
    const employee = await this.getEmployee(id);
    return employee.toSafeEmployee();
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<SafeEmployeeDto> {
    const employee = await this.getEmployee(id);
    await this.checkEmployeeExistence(updateEmployeeDto.phone_number);
    const groups = await this.groupsService.checkGroupsBelongToOrganization(
      updateEmployeeDto.groupsIds,
      employee.organization.id,
    );
    await this.employeesRepository.update(id, {
      ...updateEmployeeDto,
      groups,
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeEmployeeDto> {
    const employee = await this.getEmployee(id);
    await this.employeesRepository.softDelete(id);
    return employee.toSafeEmployee();
  }

  async restore(id: string): Promise<SafeEmployeeDto> {
    await this.employeesRepository.restore(id);
    return this.findOne(id);
  }

  async getGroups(id: string): Promise<SafeGroupDto[]> {
    const employee = await this.getEmployee(id);
    return employee.getGroups().map((g) => g.toSafeGroup());
  }

  async addGroupToEmployee(
    groupId: string,
    employeeId: string,
  ): Promise<SafeEmployeeDto> {
    const employee = await this.getEmployee(employeeId);
    const group = await this.groupsService.getGroup(groupId);
    employee.addGroup(group);
    const savedUser = await this.employeesRepository.save(employee);
    return savedUser.toSafeEmployee();
  }

  async removeGroupFromEmployee(
    groupId: string,
    employeeId: string,
  ): Promise<SafeEmployeeDto> {
    const employee = await this.getEmployee(employeeId);
    const group = await this.groupsService.getGroup(groupId);
    employee.removeGroup(group);
    const savedEmployee = await this.employeesRepository.save(employee);
    return savedEmployee.toSafeEmployee();
  }

  async checkEmployeesBelongToOrganization(
    employeesIds: string[],
    organizationId: string,
  ): Promise<Employee[]> {
    const employees = new Array<Employee>();
    for (const employeeId of employeesIds) {
      const employee = await this.getEmployee(employeeId);
      if (employee.organization.id !== organizationId) {
        throw new ConflictException(
          'Employee cannot be assigned to a group from another organization',
        );
      }
      employees.push(employee);
    }
    return employees;
  }

  // Auth

  async findOneByPhoneNumber(phoneNumber: string): Promise<Employee> {
    if (!phoneNumber) return null;
    return await this.employeesRepository.findOne({
      where: [{ phone_number: phoneNumber }],
    });
  }

  async setNewOTP(employee: Employee, otp: string): Promise<Employee> {
    employee.otp = otp;
    employee.otp_expires_at = new Date(Date.now() + 5 * 60 * 1000);
    await this.employeesRepository.save(employee);
    return await this.getEmployee(employee.id);
  }
}
