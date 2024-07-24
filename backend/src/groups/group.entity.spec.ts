import { Organization } from '../organizations/organization.entity';
import { Employee } from '../employees/employee.entity';
import { Group } from './group.entity';

describe('Group Entity', () => {
  let organization1: Organization;
  let organization2: Organization;
  let group: Group;
  let employee1: Employee;
  let employee2: Employee;

  beforeEach(() => {
    organization1 = new Organization();
    organization1.id = '1';
    organization2 = new Organization();
    organization2.id = '2';

    group = new Group();
    group.id = '1';
    group.organization = organization1;
    group.name = 'Test Group';

    employee1 = new Employee();
    employee1.id = '1';
    employee1.organization = organization1;
    employee1.name = 'John';
    employee1.phone_number = '912345678';

    employee2 = new Employee();
    employee2.id = '2';
    employee2.organization = organization1;
    employee2.name = 'Jane';
    employee2.phone_number = '987654321';
  });

  it('should get non initialized employees as an empty array', () => {
    expect(Array.isArray(group.getEmployees())).toBe(true);
    expect(group.getEmployees().length).toBe(0);
  });

  describe('addEmployee', () => {
    it('should add a new employee to the group', () => {
      const updatedEmployees = group.addEmployee(employee1);
      expect(updatedEmployees).toHaveLength(1);
      expect(updatedEmployees[0]).toBe(employee1);
    });

    it('should not add employee from different organization', () => {
      employee1.organization = organization2;
      const updatedEmployees = group.addEmployee(employee1);
      expect(updatedEmployees).toHaveLength(0);
    });

    it('should not add duplicate employees', () => {
      group.addEmployee(employee1);
      const updatedEmployees = group.addEmployee(employee1);
      expect(updatedEmployees).toHaveLength(1);
      expect(updatedEmployees[0]).toBe(employee1);
    });

    it('should return all employees after adding', () => {
      group.addEmployee(employee1);
      const updatedEmployees = group.addEmployee(employee2);
      expect(updatedEmployees).toHaveLength(2);
      expect(updatedEmployees).toContain(employee1);
      expect(updatedEmployees).toContain(employee2);
    });
  });

  describe('removeEmployee', () => {
    beforeEach(() => {
      group.addEmployee(employee1);
      group.addEmployee(employee2);
    });

    it('should remove an employee from the group', () => {
      const updatedEmployees = group.removeEmployee(employee1);
      expect(updatedEmployees).toHaveLength(1);
      expect(updatedEmployees[0]).toBe(employee2);
      expect(updatedEmployees).not.toContain(employee1);
    });

    it('should do nothing when removing a non-existent employee', () => {
      const nonExistentEmployee = new Employee();
      nonExistentEmployee.id = '3';
      const updatedEmployees = group.removeEmployee(nonExistentEmployee);
      expect(updatedEmployees).toHaveLength(2);
      expect(updatedEmployees).toContain(employee1);
      expect(updatedEmployees).toContain(employee2);
    });

    it('should return an empty array when removing the last employee', () => {
      group.removeEmployee(employee1);
      const updatedEmployees = group.removeEmployee(employee2);
      expect(updatedEmployees).toHaveLength(0);
    });
  });
});
