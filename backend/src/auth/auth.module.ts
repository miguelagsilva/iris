import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [UsersModule, EmployeesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
