import { IsDate, IsJSON } from 'class-validator';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryColumn()
  sid: string;

  @Column('jsonb')
  @IsJSON()
  sess: string;

  @Column()
  @IsDate()
  expiresAt: Date;
}
