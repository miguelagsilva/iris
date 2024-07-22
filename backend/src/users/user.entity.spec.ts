import { validate } from 'class-validator';
import { User } from './user.entity';
import { Role } from '../roles/roles.enum';
import { plainToClass } from 'class-transformer';

describe('User Entity', () => {
  function generateUuid(): string {
    const hexDigits = '0123456789abcdef';
    let uuid = '';

    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += '-';
      } else if (i === 14) {
        uuid += '4';
      } else if (i === 19) {
        uuid += hexDigits[(Math.random() * 4) | 8];
      } else {
        uuid += hexDigits[Math.floor(Math.random() * 16)];
      }
    }

    return uuid;
  }

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
    const length = Math.floor(Math.random() * 56) + 8; // 8 to 63 characters
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password + '1'; // Ensure at least one number, max length will be 64
  };

  const createValidUser = () => ({
    id: generateUuid(),
    firstName: generateValidName(),
    lastName: generateValidName(),
    email: generateValidEmail(),
    password: generateValidPassword(),
    role: Object.values(Role)[Math.floor(Math.random() * Object.values(Role).length)],
  });

  it('should create a valid user', async () => {
    for (let i = 0; i < 100; i++) {
      const userData = createValidUser();
      const user = plainToClass(User, userData);
      const errors = await validate(user);
      if (errors.length > 0) {
        console.log('Validation errors:', errors);
      }
      expect(errors).toHaveLength(0);
    }
  });

  // ... (keep the other test cases)

  it('should create a valid SafeUserDto', async () => {
    for (let i = 0; i < 100; i++) {
      const userData = createValidUser();
      const user = plainToClass(User, userData);
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
