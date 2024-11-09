import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { UserRole } from './enum/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv7();

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: UserRole;

  @Column()
  @Exclude()
  password: string;
}
