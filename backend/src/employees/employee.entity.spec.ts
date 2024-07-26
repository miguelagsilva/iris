import { Organization } from '../organizations/organization.entity';
import { Group } from '../groups/group.entity';
import { Employee } from './employee.entity';

describe('Employee Entity', () => {
  let organization1: Organization;
  let organization2: Organization;
  let employee: Employee;
  let group1: Group;
  let group2: Group;

  beforeEach(() => {
    organization1 = new Organization();
    organization1.id = '1';

    organization2 = new Organization();
    organization2.id = '2';

    employee = new Employee();
    employee.id = '1';
    employee.organization = organization1;
    employee.name = 'John';
    employee.phone_number = '912345678';

    group1 = new Group();
    group1.id = '1';
    group1.organization = organization1;

    group2 = new Group();
    group2.id = '2';
    group2.organization = organization1;
  });

  it('should get non initialized groups as an empty array', () => {
    expect(Array.isArray(employee.getGroups())).toBe(true);
    expect(employee.getGroups().length).toBe(0);
  });

  describe('addGroup', () => {
    it('should add a new group to the employee', () => {
      const updatedGroups = employee.addGroup(group1);

      expect(updatedGroups).toHaveLength(1);
      expect(updatedGroups[0]).toBe(group1);
    });

    it('should not add group from different organization', () => {
      group1.organization = organization2;

      const updatedGroups = employee.addGroup(group1);

      expect(updatedGroups).toHaveLength(0);
    });

    it('should not add duplicate groups', () => {
      employee.addGroup(group1);
      const updatedGroups = employee.addGroup(group1);

      expect(updatedGroups).toHaveLength(1);
      expect(updatedGroups[0]).toBe(group1);
    });

    it('should return all groups after adding', () => {
      employee.addGroup(group1);
      const updatedGroups = employee.addGroup(group2);

      expect(updatedGroups).toHaveLength(2);
      expect(updatedGroups).toContain(group1);
      expect(updatedGroups).toContain(group2);
    });
  });

  describe('removeGroup', () => {
    beforeEach(() => {
      employee.addGroup(group1);
      employee.addGroup(group2);
    });

    it('should remove a group from the employee', () => {
      const updatedGroups = employee.removeGroup(group1);

      expect(updatedGroups).toHaveLength(1);
      expect(updatedGroups[0]).toBe(group2);
      expect(updatedGroups).not.toContain(group1);
    });

    it('should do nothing when removing a non-existent group', () => {
      const nonExistentGroup = new Group();
      nonExistentGroup.id = '3';

      const updatedGroups = employee.removeGroup(nonExistentGroup);

      expect(updatedGroups).toHaveLength(2);
      expect(updatedGroups).toContain(group1);
      expect(updatedGroups).toContain(group2);
    });

    it('should return an empty array when removing the last group', () => {
      employee.removeGroup(group1);
      const updatedGroups = employee.removeGroup(group2);

      expect(updatedGroups).toHaveLength(0);
    });
  });
});
