import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'testing',
      synchronize: true, // Automatically sync the database schem. Only use for development
      autoLoadEntities: true, // Gets and loads all entities from the entities array in the TypeOrmModule.forRoot() method
    }),
    TestModule, UsersModule,
  ],
})
export class AppModule {}
