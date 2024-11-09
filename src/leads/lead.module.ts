import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lead]), UserModule],
  providers: [LeadService],
  controllers: [LeadController],
})
export class LeadModule {}
