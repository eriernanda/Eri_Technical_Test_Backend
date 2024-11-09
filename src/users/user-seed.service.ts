import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './enum/user-role.enum';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedUsers() {
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      console.log('Users already seeded');
      return;
    }

    const createUser = async (name: string, role: UserRole) => {
      const user = new User();
      user.name = name;
      user.email = `${name}@email.com`;
      user.role = role;
      user.password = await bcrypt.hash('password', 10);

      await this.userRepository.save(user);
    };

    await createUser('superadmin', UserRole.SUPER_ADMIN);
    await createUser('customer_service', UserRole.CUSTOMER_SERVICE);
    await createUser('operational', UserRole.OPERATIONAL);

    for (let i = 1; i <= 5; i++) {
      await createUser(`sales_${i}`, UserRole.SALESPERSON);
    }

    console.log('Seeding complete!');
  }
}
