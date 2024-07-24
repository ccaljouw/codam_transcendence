import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './errorHandling/prisma-client-exception.filter';
import { HttpErrorFilter } from './errorHandling/exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Transcendence')
    .setDescription('Final Codam project')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(
    new PrismaClientExceptionFilter(),
    new HttpErrorFilter(),
  );

  // use pipes to validate requests (as defined in DTOs,
  // whitelist: true strips out addition information that is send but not part of the DTO)
  // It’s important to note that this option will filter all properties without validation decorators,
  // even if they are defined in the DTO.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); //forbidNonWhitelisted: true

  app.enableCors({
    origin: [
      `${process.env.FRONTEND_URL_LOCAL}`,
      `${process.env.FRONTEND_URL}`,
    ],
    methods: 'GET,PATCH,POST,DELETE, ',
    allowedHeaders: 'Content-Type',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
