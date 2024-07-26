import { INestApplication } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export async function cleanupDatabase(app: INestApplication) {
  const dataSource = app.get<DataSource>(getDataSourceToken());
  const entities = dataSource.entityMetadatas;

  try {
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
    }
  } catch (error) {
    throw error;
  }
}

export async function runInTransaction<T>(
  app: INestApplication,
  operation: () => Promise<T>,
): Promise<T> {
  const dataSource = app.get<DataSource>(getDataSourceToken());
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await operation();
    await queryRunner.commitTransaction();
    return result;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
