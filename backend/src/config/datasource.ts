import { DataSource } from 'typeorm';

export const dataSourceOptions = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'iris_development',
  synchronize: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['migrations/*.ts'],
});
