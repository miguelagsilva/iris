import { PickType } from '@nestjs/swagger';
import { Employee } from '../employee.entity';

export class SafeEmployeeDto extends PickType(Employee, ['id', 'name', 'phone_number', 'organization'] as const) {
  static fromEmployee(employee: Employee): SafeEmployeeDto {
    const { id, name, phone_number, organization } = employee;
    return { id, name, phone_number, organization };
  }
}
