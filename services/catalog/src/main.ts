import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 5001;
  await app.listen(port);
  
  console.log(`🛍️  Catalog Service running on http://localhost:${port}`);
}

bootstrap();