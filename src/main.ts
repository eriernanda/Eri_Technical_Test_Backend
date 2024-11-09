import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserSeedService } from './users/user-seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const userSeedService = app.get(UserSeedService);
  await userSeedService.seedUsers();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
