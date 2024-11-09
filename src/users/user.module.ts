import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSeedService } from './user-seed.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'n3St-sLAse34)',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService, UserSeedService],
  controllers: [UserController],
  exports: [UserSeedService, TypeOrmModule],
})
export class UserModule {}
