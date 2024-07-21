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
import { SafeGroupDto } from 'src/groups/dto/safe-group.dto';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @Inject(forwardRef(() => OrganizationsService))
    private organizationService: OrganizationsService,
  ) {}

  async getEmployee(id: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { id: id },
      relations: ['organization']
    });
    if (!employee) {
      throw new NotFoundException(`Employee with id "${id}" not found`);
    }
    return employee;
  }

  async create(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<SafeEmployeeDto> {
    const existingEmployee = await this.employeesRepository.findOne({
      where: {
        phone_number: createEmployeeDto.phone_number,
        organization: { id: createEmployeeDto.organizationId },
      },
    });

    if (existingEmployee) {
      throw new ConflictException(
        'Employee with this phone number already exists in the organization',
      );
    }

    const { organizationId, ...newEmployee } = createEmployeeDto; 

    const organization = await this.organizationService.findOne(organizationId);
    if (!organization) {
      throw new NotFoundException(`Organization with id "${organizationId}" not found`);
    }

    const savedEmployee = await this.employeesRepository.save({ ...newEmployee, organization });

    return SafeEmployeeDto.fromEmployee(savedEmployee);
  }

  async findAll(): Promise<SafeEmployeeDto[]> {
    const employees = await this.employeesRepository.find();
    return employees.map(SafeEmployeeDto.fromEmployee);
  }

  async findOne(id: string): Promise<SafeEmployeeDto> {
    const employee = await this.getEmployee(id);
    return SafeEmployeeDto.fromEmployee(employee);
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<SafeEmployeeDto> {
    const existingEmployee = await this.employeesRepository.findOne({
      where: {
        name: updateEmployeeDto.name,
        organization: { id: updateEmployeeDto.organizationId },
      },
    });
    if (existingEmployee) {
      throw new ConflictException(
        'Employee with this name already exists in the organization',
      );
    }

    await this.employeesRepository.update(id, updateEmployeeDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<SafeEmployeeDto> {
    const employee = await this.getEmployee(id);
    await this.employeesRepository.softDelete(id);
    return SafeEmployeeDto.fromEmployee(employee);
  }

  async restore(id: string): Promise<SafeEmployeeDto> {
    const result = await this.employeesRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Employee with id "${id}" not found or already restored`,
      );
    }
    return this.findOne(id);
  }

  // Groups

  async getGroups(id: string): Promise<SafeGroupDto[]> {
    const employee = await this.getEmployee(id);
    const groups = employee.groups; 
    return groups.map(SafeGroupDto.fromGroup);
  }
}
