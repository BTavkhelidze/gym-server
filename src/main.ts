import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://gym-front-seven.vercel.app',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
