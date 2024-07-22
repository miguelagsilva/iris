import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { GroupsService } from '../groups/groups.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { SafeEmployeeDto } from './dto/safe-employee.dto';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let employeesService: EmployeesService;
  let groupsService: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            restore: jest.fn(),
          },
        },
        {
          provide: GroupsService,
          useValue: {
            getEmployees: jest.fn(),
            addEmployeeToGroup: jest.fn(),
            removeEmployeeOfGroup: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    employeesService = module.get<EmployeesService>(EmployeesService);
    groupsService = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'John Doe',
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        phone_number: '+351912345678',
      };
      const expectedResult: SafeEmployeeDto = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
      };

      jest.spyOn(employeesService, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createEmployeeDto)).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should get an employee by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174001';
      const expectedResult: SafeEmployeeDto = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
      };

      jest.spyOn(employeesService, 'findOne').mockResolvedValue(expectedResult);

      expect(await controller.findOne(id)).toBe(expectedResult);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174001';
      const updateEmployeeDto: UpdateEmployeeDto = { name: 'Jane Doe' };
      const expectedResult: SafeEmployeeDto = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Jane Doe',
        phone_number: '+351912345678',
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
      };

      jest.spyOn(employeesService, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update(id, updateEmployeeDto)).toBe(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174001';
      const expectedResult: SafeEmployeeDto = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
      };

      jest.spyOn(employeesService, 'remove').mockResolvedValue(expectedResult);

      expect(await controller.remove(id)).toBe(expectedResult);
    });
  });

  describe('restore', () => {
    it('should restore an employee', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174001';
      const expectedResult: SafeEmployeeDto = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'John Doe',
        phone_number: '+351912345678',
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
      };

      jest.spyOn(employeesService, 'restore').mockResolvedValue(expectedResult);

      expect(await controller.restore(id)).toBe(expectedResult);
    });
  });

  describe('getEmployees', () => {
    it('should get all groups of an employee', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174001';
      const expectedResult: SafeEmployeeDto[] = [
        { id: '123e4567-e89b-12d3-a456-426614174002', name: 'Group 1', phone_number: '+351912345679', organizationId: '123e4567-e89b-12d3-a456-426614174000' },
        { id: '123e4567-e89b-12d3-a456-426614174003', name: 'Group 2', phone_number: '+351912345680', organizationId: '123e4567-e89b-12d3-a456-426614174000' },
      ];

      jest.spyOn(groupsService, 'getEmployees').mockResolvedValue(expectedResult);

      expect(await controller.getEmployees(id)).toBe(expectedResult);
    });
  });

  describe('addEmployeeToGroup', () => {
    it('should add an employee to a group', async () => {
      const employeeId = '123e4567-e89b-12d3-a456-426614174001';
      const groupId = '123e4567-e89b-12d3-a456-426614174002';
      const expectedResult: SafeEmployeeDto[] = [
        { id: '123e4567-e89b-12d3-a456-426614174001', name: 'John Doe', phone_number: '+351912345678', organizationId: '123e4567-e89b-12d3-a456-426614174000' },
      ];

      jest.spyOn(groupsService, 'addEmployeeToGroup').mockResolvedValue(expectedResult);

      expect(await controller.addEmployeeToGroup(employeeId, groupId)).toBe(expectedResult);
    });
  });

  describe('removeEmployeeOfGroup', () => {
    it('should remove an employee from a group', async () => {
      const employeeId = '123e4567-e89b-12d3-a456-426614174001';
      const groupId = '123e4567-e89b-12d3-a456-426614174002';
      const expectedResult: SafeEmployeeDto[] = [];

      jest.spyOn(groupsService, 'removeEmployeeOfGroup').mockResolvedValue(expectedResult);

      expect(await controller.removeEmployeeOfGroup(employeeId, groupId)).toBe(expectedResult);
    });
  });
});
