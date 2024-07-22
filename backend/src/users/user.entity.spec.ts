import { validate } from 'class-validator';
import { User } from './user.entity';
import { Role } from '../roles/roles.enum';
import { plainToClass } from 'class-transformer';

describe('User Entity', () => {
  const generateValidName = () => {
    const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-\'';
    const length = Math.floor(Math.random() * 49) + 2; // 2 to 50 characters
    return Array(length).fill(null).map(() => validChars[Math.floor(Math.random() * validChars.length)]).join('');
  };

  const generateValidEmail = () => {
    const username = Math.random().toString(36).substring(2, 15);
    const domain = Math.random().toString(36).substring(2, 10);
    return `${username}@${domain}.com`;
  };

  const generateValidPassword = () => {
    const length = Math.floor(Math.random() * 57) + 8; // 8 to 64 characters
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password + '1'; // Ensure at least one number
  };

  const createValidUser = () => ({
    firstName: generateValidName(),
    lastName: generateValidName(),
    email: generateValidEmail(),
    password: generateValidPassword(),
    role: Object.values(Role)[Math.floor(Math.random() * Object.values(Role).length)],
  });

  it('should create a valid user', async () => {
    for (let i = 0; i < 100; i++) { // Run 100 times
      const userData = createValidUser();
      const user = plainToClass(User, userData);
      const errors = await validate(user);
      expect(errors).toHaveLength(0);
    }
  });

  it('should reject invalid email', async () => {
    for (let i = 0; i < 100; i++) { // Run 100 times
      const userData = createValidUser();
      userData.email = 'invalid-email';
      const user = plainToClass(User, userData);
      const errors = await validate(user);
      expect(errors.some(e => e.property === 'email')).toBe(true);
    }
  });

  it('should reject invalid password', async () => {
    for (let i = 0; i < 100; i++) { // Run 100 times
      const userData = createValidUser();
      userData.password = 'short'; // Too short and no number
      const user = plainToClass(User, userData);
      const errors = await validate(user);
      expect(errors.some(e => e.property === 'password')).toBe(true);
    }
  });

  it('should reject invalid names', async () => {
    for (let i = 0; i < 100; i++) { // Run 100 times
      const userData = createValidUser();
      userData.firstName = '123'; // Invalid characters
      userData.lastName = 'a'; // Too short
      const user = plainToClass(User, userData);
      const errors = await validate(user);
      expect(errors.some(e => e.property === 'firstName' || e.property === 'lastName')).toBe(true);
    }
  });

  it('should create a valid SafeUserDto', async () => {
    for (let i = 0; i < 100; i++) { // Run 100 times
      const userData = createValidUser();
      const user = plainToClass(User, {
        id: 'some-uuid', // You might want to generate this
        ...userData,
      });
      const safeUser = user.toSafeUser();
      expect(safeUser).not.toHaveProperty('password');
      expect(safeUser).toHaveProperty('id');
      expect(safeUser).toHaveProperty('email');
      expect(safeUser).toHaveProperty('firstName');
      expect(safeUser).toHaveProperty('lastName');
      expect(safeUser).toHaveProperty('role');
    }
  });
});
