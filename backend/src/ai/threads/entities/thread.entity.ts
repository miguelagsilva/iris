import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import {
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { Exclude, plainToInstance } from 'class-transformer';
import { Employee } from '../../../employees/employee.entity';
import { Assistant } from '../../../ai/assistants/entities/assistant.entity';
import { SafeThreadDto } from '../dto/safe-thread.dto';

@Entity()
@Unique(['openai_id'])
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsNotEmpty()
  openai_id: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => Assistant, (assistant) => assistant.threads)
  assistant: Assistant;

  @ManyToOne(() => Employee, (employee) => employee.threads)
  employee: Employee;

  toSafeThread(): SafeThreadDto {
    return plainToInstance(SafeThreadDto, this, {
      excludeExtraneousValues: true,
    });
  }
}
