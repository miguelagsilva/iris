import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SafeOrganizationDto } from 'src/organizations/dto/safe-organization.dto';
import { Group } from '../groups/group.entity';

class MockGroup {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  organization: any;
  employees: any[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.organization = { id: 'baccb07d-632f-45a3-841d-4b43879571e2' };
    this.employees = [];
  }

  toSafeGroup() {
    return {
      id: this.id,
      name: this.name,
      organizationId: this.organization.id,
    };
  }
}

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repository: Repository<Employee>;
  let organizationsService: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useClass: Repository,
        },
        {
          provide: OrganizationsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    repository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
    organizationsService = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEmployee', () => {
    it('should return an employee if found', async () => {
      const mockEmployee = new Employee();
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockEmployee);

      const result = await service.getEmployee('123');
      expect(result).toBe(mockEmployee);
    });

    it('should throw NotFoundException if employee not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getEmployee('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      };
      const mockOrganization = { id: '123', name: 'Test Org' };
      const mockEmployee = new Employee();
      mockEmployee.toSafeEmployee = jest.fn().mockReturnValue({
        id: '456',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      });

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(organizationsService, 'findOne').mockResolvedValue(mockOrganization as SafeOrganizationDto);
      jest.spyOn(repository, 'save').mockResolvedValue(mockEmployee);

      const result = await service.create(createEmployeeDto);
      expect(result).toEqual({
        id: '456',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      });
    });

    it('should throw ConflictException if employee already exists', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(new Employee());

      await expect(service.create(createEmployeeDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of safe employee DTOs', async () => {
      const mockEmployees = [new Employee(), new Employee()];
      mockEmployees.forEach(employee => {
        employee.toSafeEmployee = jest.fn().mockReturnValue({
          id: '456',
          name: 'John Doe',
          phone_number: '+351912345678',
          organizationId: '123',
        });
      });

      jest.spyOn(repository, 'find').mockResolvedValue(mockEmployees);

      const result = await service.findAll();
      expect(result).toEqual([
        { id: '456', name: 'John Doe', phone_number: '+351912345678', organizationId: '123' },
        { id: '456', name: 'John Doe', phone_number: '+351912345678', organizationId: '123' },
      ]);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updateEmployeeDto: UpdateEmployeeDto = { name: 'Jane Doe' };
      const mockEmployee = new Employee();
      mockEmployee.toSafeEmployee = jest.fn().mockReturnValue({
        id: '456',
        name: 'Jane Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      });

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockEmployee.toSafeEmployee());

      const result = await service.update('456', updateEmployeeDto);
      expect(result).toEqual({
        id: '456',
        name: 'Jane Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      });
    });

    it('should throw ConflictException if employee name already exists in organization', async () => {
      const updateEmployeeDto: UpdateEmployeeDto = { name: 'Jane Doe', organizationId: '123' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(new Employee());

      await expect(service.update('456', updateEmployeeDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should soft delete an employee', async () => {
      const mockEmployee = new Employee();
      mockEmployee.toSafeEmployee = jest.fn().mockReturnValue({
        id: '456',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      });

      jest.spyOn(service, 'getEmployee').mockResolvedValue(mockEmployee);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);

      const result = await service.remove('456');
      expect(result).toEqual({
        id: '456',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      });
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted employee', async () => {
      const mockEmployee = new Employee();
      mockEmployee.toSafeEmployee = jest.fn().mockReturnValue({
        id: '456',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      });

      jest.spyOn(repository, 'restore').mockResolvedValue({ affected: 1, raw: {} } as UpdateResult);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockEmployee.toSafeEmployee());

      const result = await service.restore('456');
      expect(result).toEqual({
        id: '456',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123',
      });
    });

    it('should throw NotFoundException if employee not found or already restored', async () => {
      jest.spyOn(repository, 'restore').mockResolvedValue({ affected: 0, raw: {} } as UpdateResult);

      await expect(service.restore('456')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getGroups', () => {
    it('should return an array of safe group DTOs', async () => {
      const mockEmployee = new Employee();
      mockEmployee.groups = [
        new MockGroup('789', 'Group 1'),
        new MockGroup('012', 'Group 2'),
      ];

      jest.spyOn(service, 'getEmployee').mockResolvedValue(mockEmployee);

      const result = await service.getGroups('456');
      expect(result).toEqual([
        { id: '789', name: 'Group 1', organizationId: 'baccb07d-632f-45a3-841d-4b43879571e2' },
        { id: '012', name: 'Group 2', organizationId: 'baccb07d-632f-45a3-841d-4b43879571e2' },
      ]);
    });
  });
});
