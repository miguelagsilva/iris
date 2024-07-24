import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { SafeEmployeeDto } from './dto/safe-employee.dto';
import { SafeGroupDto } from '../groups/dto/safe-group.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { GroupsService } from 'src/groups/groups.service';

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

  private async checkEmployeeExistence(
    phoneNumber: string,
    organizationId: string,
  ) {
    const existingEmployee = await this.employeesRepository.findOne({
      where: {
        phone_number: phoneNumber,
        organization: { id: organizationId },
      },
    });
    if (existingEmployee) {
      throw new ConflictException(
        'Employee with this name already exists in the organization',
      );
    }
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
    await this.checkEmployeeExistence(
      createEmployeeDto.phone_number,
      createEmployeeDto.organizationId,
    );
    const { organizationId, ...newEmployee } = createEmployeeDto;
    const organization =
      await this.organizationService.getOrganization(organizationId);
    const createdEmployee = this.employeesRepository.create({
      ...newEmployee,
      organization,
    });
    await this.employeesRepository.save(createdEmployee);
    return this.findOne(createdEmployee.id);
  }

  async findAll(): Promise<SafeEmployeeDto[]> {
    const employees = await this.employeesRepository.find();
    return employees.map((e) => e.toSafeEmployee());
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
    await this.checkEmployeeExistence(
      updateEmployeeDto.phone_number,
      employee.organization.id,
    );
    await this.employeesRepository.update(id, updateEmployeeDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeEmployeeDto> {
    await this.employeesRepository.softDelete(id);
    return this.findOne(id);
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
}
