import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { LeadStatus } from './enum/lead-status.enum';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv7();

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('smallint', { default: 0 })
  status: LeadStatus;

  @Column({ nullable: true })
  sales_id?: string;

  @Column({ default: 0 })
  follow_up_count?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
