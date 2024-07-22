import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SafeUserDto } from './dto/safe-user.dto';
import { Role } from '../roles/roles.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            restore: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Michael',
        lastName: 'De Santa',
      };
      const expectedResult: SafeUserDto = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Michael',
        lastName: 'De Santa',
        organizationId: '1',
        role: Role.USER,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createUserDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedResult: SafeUserDto[] = [
        {
          id: '1',
          email: 'user1@example.com',
          firstName: 'Michael',
          lastName: 'De Santa',
          organizationId: '1',
          role: Role.USER,
        },
        {
          id: '2',
          email: 'user2@example.com',
          firstName: 'Franklin',
          lastName: 'Clinton',
          organizationId: '1',
          role: Role.ADMIN,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const expectedResult: SafeUserDto = {
        id: userId,
        email: 'user@example.com',
        firstName: 'Michael',
        lastName: 'De Santa',
        organizationId: '1',
        role: Role.USER,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      expect(await controller.findOne(userId)).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        firstName: 'Trevor',
        lastName: 'Philips',
      };
      const expectedResult: SafeUserDto = {
        id: userId,
        email: 'updated@example.com',
        firstName: 'Trevor',
        lastName: 'Philips',
        organizationId: '1',
        role: Role.ADMIN,
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update(userId, updateUserDto)).toBe(
        expectedResult,
      );
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('partialUpdate', () => {
    it('should partially update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'Trevor' };
      const expectedResult: SafeUserDto = {
        id: userId,
        email: 'partial@example.com',
        firstName: 'Trevor',
        lastName: 'De Santa',
        organizationId: '1',
        role: Role.USER,
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.partialUpdate(userId, updateUserDto)).toBe(
        expectedResult,
      );
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      const expectedResult: SafeUserDto = {
        id: userId,
        email: 'removed@example.com',
        firstName: 'Michael',
        lastName: 'De Santa',
        organizationId: '1',
        role: Role.USER,
      };

      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);

      expect(await controller.remove(userId)).toBe(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(userId);
    });
  });

  describe('restore', () => {
    it('should restore a user', async () => {
      const userId = '1';
      const expectedResult: SafeUserDto = {
        id: userId,
        email: 'restored@example.com',
        firstName: 'Michael',
        lastName: 'De Santa',
        organizationId: '1',
        role: Role.USER,
      };

      jest.spyOn(service, 'restore').mockResolvedValue(expectedResult);

      expect(await controller.restore(userId)).toBe(expectedResult);
      expect(service.restore).toHaveBeenCalledWith(userId);
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      const req = { user: { id: '1' } };
      const expectedResult: SafeUserDto = {
        id: '1',
        email: 'current@example.com',
        firstName: 'Michael',
        lastName: 'De Santa',
        organizationId: '1',
        role: Role.USER,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      expect(await controller.getCurrentUser(req)).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(req.user.id);
    });
  });

  describe('updateCurrentUser', () => {
    it('should update the current user', async () => {
      const req = { user: { id: '1' } };
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        firstName: 'Trevor',
      };
      const expectedResult: SafeUserDto = {
        id: '1',
        email: 'updated@example.com',
        firstName: 'Trevor',
        lastName: 'De Santa',
        organizationId: '1',
        role: Role.USER,
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.updateCurrentUser(req, updateUserDto)).toBe(
        expectedResult,
      );
      expect(service.update).toHaveBeenCalledWith(req.user.id, updateUserDto);
    });
  });
});
