import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get<string>('CORS_ALLOWED_ORIGIN');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe()); // Ensure this is enabled

  app.enableCors({
    origin: [allowedOrigins],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
