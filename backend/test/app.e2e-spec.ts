import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { cleanupDatabase, runInTransaction } from './test-utils';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    await cleanupDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  let currentOrganization = {
    id: undefined,
    code: 'ORG001',
    name: 'Test Organization',
  };

  describe('Organizations (CRUD)', () => {
    it('/api/v1/organizations (POST) - Create a new organization', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .post('/api/v1/organizations')
          .send(currentOrganization)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('code', currentOrganization.code);
            expect(res.body).toHaveProperty('name', currentOrganization.name);
            expect(res.body).toHaveProperty('id');
            currentOrganization = res.body;
          });
      });
    });

    it('/api/v1/organizations (GET) - Get all organizations', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .get('/api/v1/organizations')
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('code');
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body).toContainEqual(currentOrganization);
          });
      });
    });

    it('/api/v1/organizations/{id} (GET) - Get a single organization', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .get(`/api/v1/organizations/${currentOrganization.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('id');
            expect(res.body).toEqual(currentOrganization);
          });
      });
    });

    it('/api/v1/organizations/{id} (PUT) - Update an organization', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .put(`/api/v1/organizations/${currentOrganization.id}`)
          .send({
            code: 'ORG002',
            name: 'Updated Test Organization',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('code', 'ORG002');
            expect(res.body).toHaveProperty(
              'name',
              'Updated Test Organization',
            );
            expect(res.body).toHaveProperty('id');
            currentOrganization = res.body;
          });
      });
    });

    it('/api/v1/organizations/{id} (PATCH) - Partially update an organization', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .patch(`/api/v1/organizations/${currentOrganization.id}`)
          .send({
            name: 'Partially Updated Organization',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('code', currentOrganization.code);
            expect(res.body).toHaveProperty(
              'name',
              'Partially Updated Organization',
            );
            expect(res.body).toHaveProperty('id');
            currentOrganization = res.body;
          });
      });
    });

    it('/api/v1/organizations/{id} (DELETE) - Soft delete an organization', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .delete(`/api/v1/organizations/${currentOrganization.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('id');
            expect(res.body).toEqual(currentOrganization);
          });
      });
    });

    it('/api/v1/organizations/{id}/restore (POST) - Restore a soft-deleted organization', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .post(`/api/v1/organizations/${currentOrganization.id}/restore`)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('id');
            expect(res.body).toEqual(currentOrganization);
          });
      });
    });
  });
});
/*
  describe('Organization Relationships', () => {

    it('/api/v1/organizations/{id}/users (GET) - Get all users in an organization', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .get(`/api/v1/organizations/${currentOrganization.id}/users`)
          .expect(200)
          .expect(res => {
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toEqual(0);
          });
      });
    });

    it('/api/v1/organizations/{id}/groups (GET) - Get all groups of an organization', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .get(`/api/v1/organizations/${currentOrganization.id}/groups`)
          .expect(200)
          .expect(res => {
            expect(Array.isArray(res.body)).toBeTruthy();
            if (res.body.length > 0) {
              expect(res.body[0]).toHaveProperty('id');
              expect(res.body[0]).toHaveProperty('name');
              expect(res.body[0]).toHaveProperty('organizationId');
            }
          });
      });
    });

    it('/api/v1/organizations/{id}/employees (GET) - Get all employees of an organization', () => {
      return runInTransaction(app, async () => {
        return request(app.getHttpServer())
          .get(`/api/v1/organizations/${currentOrganization.id}/employees`)
          .expect(200)
          .expect(res => {
            expect(Array.isArray(res.body)).toBeTruthy();
            if (res.body.length > 0) {
              expect(res.body[0]).toHaveProperty('id');
              expect(res.body[0]).toHaveProperty('name');
              expect(res.body[0]).toHaveProperty('phone_number');
              expect(res.body[0]).toHaveProperty('organizationId');
            }
          });
      });
    });
  });
});
*/
