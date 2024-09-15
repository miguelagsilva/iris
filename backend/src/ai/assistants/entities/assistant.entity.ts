import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Unique,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { Exclude, plainToInstance } from 'class-transformer';
import { Thread } from '../../../ai/threads/entities/thread.entity';
import { Group } from '../../../groups/group.entity';
import { SafeAssistantDto } from '../dto/safe-assistant.dto';

@Entity()
@Unique(['openai_id'])
export class Assistant {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsNotEmpty()
  @Exclude()
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

  @OneToOne(() => Group, (group) => group.assistant)
  group: Group;

  @OneToMany(() => Thread, (thread) => thread.assistant, {
    cascade: true,
  })
  threads: Thread[];

  toSafeAssistant(): SafeAssistantDto {
    return plainToInstance(SafeAssistantDto, this, {
      excludeExtraneousValues: true,
    });
  }
}
