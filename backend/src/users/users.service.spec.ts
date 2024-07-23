import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      const mockUser = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.getUser('1');
      expect(result).toBe(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getUser('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'michael',
        lastName: 'de santa',
      };
      const mockSavedUser = new User();
      mockSavedUser.toSafeUser = jest
        .fn()
        .mockReturnValue({ id: '1', email: 'test@example.com' });

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(mockSavedUser);
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.create(createUserDto);
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'michael',
        lastName: 'de santa',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(new User());

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of safe user DTOs', async () => {
      const mockUsers = [new User(), new User()];
      mockUsers.forEach((user) => {
        user.toSafeUser = jest
          .fn()
          .mockReturnValue({ id: '1', email: 'test@example.com' });
      });

      jest.spyOn(repository, 'find').mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual([
        { id: '1', email: 'test@example.com' },
        { id: '1', email: 'test@example.com' },
      ]);
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
      const mockUser = new User();
      mockUser.toSafeUser = jest
        .fn()
        .mockReturnValue({ id: '1', email: 'updated@example.com' });

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual({ id: '1', email: 'updated@example.com' });
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const mockUser = new User();
      mockUser.toSafeUser = jest
        .fn()
        .mockReturnValue({ id: '1', email: 'test@example.com' });

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);

      const result = await service.remove('1');
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });
  });

  describe('restore', () => {
    it('should restore a soft deleted user', async () => {
      const mockUser = new User();
      mockUser.toSafeUser = jest
        .fn()
        .mockReturnValue({ id: '1', email: 'test@example.com' });

      jest
        .spyOn(repository, 'restore')
        .mockResolvedValue({ affected: 1, raw: {} } as UpdateResult);
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.restore('1');
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });

    it('should throw NotFoundException if user not found or already restored', async () => {
      jest
        .spyOn(repository, 'restore')
        .mockResolvedValue({ affected: 0, raw: {} } as UpdateResult);

      await expect(service.restore('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('AuthFindOneByEmail', () => {
    it('should return a user if found by email', async () => {
      const mockUser = new User();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);

      const result = await service.AuthFindOneByEmail('test@example.com');
      expect(result).toBe(mockUser);
    });

    it('should return null if user not found by email', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const result = await service.AuthFindOneByEmail('test@example.com');
      expect(result).toBeNull();
    });
  });
});
