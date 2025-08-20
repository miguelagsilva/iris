import { MigrationInterface, QueryRunner } from "typeorm";
import * as argon2 from 'argon2';
import { faker } from '@faker-js/faker';

export class DevelopmentSeed1723240614476 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const organizations = [];
    const users = [];
    const employees = [];
    const groups = [];
    const employeeGroups = [];

    const organization_codes = new Set();
    const group_names = new Set();

    for (let j = 0; j < 10; j++) {
      const organization_id = faker.string.uuid();
      let organization_code = faker.word.noun({ length: 5 });
      while (organization_codes.has(organization_code)) {
        organization_code = faker.word.noun({ length: 5 });
      }
      organization_codes.add(organization_code);
      const organization_name = faker.word.noun({ length: 10 });
      organizations.push(`('${organization_id}', '${organization_code}', '${organization_name}')`);

      const userPromises = [];
      for (let i = 0; i < 50; i++) {
        const user_id = faker.string.uuid();
        const email = faker.internet.email();
        userPromises.push(argon2.hash(faker.internet.password()).then(password => {
          const firstName = faker.person.firstName().replace(/'/g, '');
          const lastName = faker.person.lastName().replace(/'/g, '');
          users.push(`('${user_id}', '${email}', '${password}', '${firstName}', '${lastName}', '${organization_id}')`);
        }));
      }
      await Promise.all(userPromises);

      const employeeIds = [];
      for (let i = 0; i < 50; i++) {
        const employee_id = faker.string.uuid();
        employeeIds.push(employee_id);
        const employee_name = faker.person.fullName().replace(/'/g, '');
        const employee_phone_number = faker.helpers.fromRegExp(/^9\d\d{7}$/).replace(/'/g, '');
        employees.push(`('${employee_id}', '${employee_name}', '${employee_phone_number}', '${organization_id}')`);
      }

      const groupIds = [];
      for (let i = 0; i < 50; i++) {
        const group_id = faker.string.uuid();
        groupIds.push(group_id);
        let group_name = faker.word.noun({ length: { min: 2, max: 20 } });
        while (group_names.has(group_name)) {
          group_name = faker.word.noun({ length: { min: 2, max: 20 } });
        }
        group_names.add(group_name);
        groups.push(`('${group_id}', '${group_name}', '${organization_id}')`);
      }

      for (const employee_id of employeeIds) {
        const assignedGroups = faker.helpers.arrayElements(groupIds, 3);
        for (const group_id of assignedGroups) {
          employeeGroups.push(`('${employee_id}', '${group_id}')`);
        }
      }

      if (j === 9) {  // For the last organization
        const seed_email = process.env.SEED_EMAIL;
        const seed_pass = await argon2.hash(process.env.SEED_PASS);
        const seed_firstName = faker.person.firstName().replace(/'/g, '');
        const seed_lastName = faker.person.lastName().replace(/'/g, '');
        const seed_user_id = faker.string.uuid();
        users.push(`('${seed_user_id}', '${seed_email}', '${seed_pass}', '${seed_firstName}', '${seed_lastName}', '${organization_id}')`);

        const employee_id = faker.string.uuid();
        const employee_name = faker.person.fullName().replace(/'/g, '');
        const employee_phone_number = process.env.SEED_PHONE_NUMBER;
        employees.push(`('${employee_id}', '${employee_name}', '${employee_phone_number}', '${organization_id}')`);
      }
    }

    // Bulk insert operations
    await queryRunner.query(`INSERT INTO "organization" ("id", "code", "name") VALUES ${organizations.join(', ')}`);
    
    // Split user inserts into batches to avoid potential issues with very large inserts
    const batchSize = 100;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await queryRunner.query(`INSERT INTO "user" ("id", "email", "password", "firstName", "lastName", "organizationId") VALUES ${batch.join(', ')}`);
    }

    await queryRunner.query(`INSERT INTO "employee" ("id", "name", "phone_number", "organizationId") VALUES ${employees.join(', ')}`);
    await queryRunner.query(`INSERT INTO "group" ("id", "name", "organizationId") VALUES ${groups.join(', ')}`);
    await queryRunner.query(`INSERT INTO "employee_groups_group" ("employeeId", "groupId") VALUES ${employeeGroups.join(', ')}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "employee_groups_group"`);
    await queryRunner.query(`DELETE FROM "employee"`);
    await queryRunner.query(`DELETE FROM "group"`);
    await queryRunner.query(`DELETE FROM "user"`);
    await queryRunner.query(`DELETE FROM "organization"`);
  }
}
