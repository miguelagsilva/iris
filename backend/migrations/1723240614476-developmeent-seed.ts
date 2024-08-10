import { DataSource, MigrationInterface, QueryRunner } from "typeorm";
import * as argon2 from 'argon2';
import { faker } from '@faker-js/faker';

export class DevelopmeentSeed1723240614476 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (let j = 0; j < 10; j++) {
      const organization_id = faker.string.uuid();
      const organization_code = faker.helpers.fromRegExp(/^[a-zA-Z0-9-]{3,10}$/);
      const organization_name = faker.helpers.fromRegExp(/^[\p{L}\p{M}0-9'\- !,&-]{5,50}$/u);
      await queryRunner.query(`
INSERT INTO "organization" ("id", "code", "name")
VALUES 
('${organization_id}', '${organization_code}', '${organization_name}')
`);

      for (let i = 0; i < 50; i++) {
        const user_id = faker.string.uuid();
        const email = faker.internet.email();
        const password = await argon2.hash(faker.internet.password());
        const firstName = faker.person.firstName().replace(/'/g, '');
        const lastName = faker.person.lastName().replace(/'/g, '');
        await queryRunner.query(`
INSERT INTO "user" ("id", "email", "password", "firstName", "lastName", "organizationId")
VALUES 
('${user_id}', '${email}', '${password}', '${firstName}', '${lastName}', '${organization_id}')
`);
      }

      const employeeIds: string[] = [];
      for (let i = 0; i < 50; i++) {
        const employee_id = faker.string.uuid();
        employeeIds.push(employee_id);
        const employee_name = faker.person.fullName().replace(/'/g, '');
        const employee_phone_number = faker.phone.number().replace(/'/g, '');
        await queryRunner.query(`
INSERT INTO "employee" ("id", "name", "phone_number", "organizationId")
VALUES 
('${employee_id}', '${employee_name}', '${employee_phone_number}', '${organization_id}')
`);
      }

      const groupIds: string[] = [];
      for (let i = 0; i < 50; i++) {
        const group_id = faker.string.uuid();
        groupIds.push(group_id);
        const group_name = faker.helpers.fromRegExp(/^[A-Za-z0-9\s'\-,.!()]{3,50}$/);
        await queryRunner.query(`
INSERT INTO "group" ("id", "name", "organizationId")
VALUES 
('${group_id}', '${group_name}', '${organization_id}')
`);
      }

      for ( const employee_id of employeeIds) {
        const assignedGroups = faker.helpers.arrayElements(groupIds, 3);

        for (const group_id of assignedGroups) {
          await queryRunner.query(`
INSERT INTO "employee_groups_group" ("employeeId", "groupId")
VALUES ('${employee_id}', '${group_id}')
`);
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "organization"`);
    await queryRunner.query(`DELETE FROM "group"`);
    await queryRunner.query(`DELETE FROM "employee"`);
    await queryRunner.query(`DELETE FROM "employee_groups_group"`);
  }

}
