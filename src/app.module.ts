import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './leads/lead.entity';
import { LeadModule } from './leads/lead.module';
import { UserModule } from './users/user.module';
import { User } from './users/user.entity';
import { LeadMiddleware } from './leads/lead.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest-sales',
      entities: [Lead, User],
      synchronize: true,
    }),
    LeadModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LeadMiddleware).forRoutes('leads');
  }
}
